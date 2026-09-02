import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { generateReceipt } from '@/lib/utils';

// Dynamic import for Razorpay to avoid issues when key is not configured
let razorpayInstance: InstanceType<typeof import('razorpay')> | null = null;

async function getRazorpay() {
  if (!razorpayInstance) {
    const Razorpay = (await import('razorpay')).default;
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }
  return razorpayInstance;
}

export class PaymentService {
  /**
   * Create a Razorpay order with idempotency protection.
   */
  static async createOrder(params: {
    merchantId: string;
    productId: string;
    quantity: number;
    customerEmail: string;
    customerName: string;
    customerPhone?: string;
    aiActionId?: string;
    idempotencyKey?: string;
  }) {
    const {
      merchantId,
      productId,
      quantity,
      customerEmail,
      customerName,
      customerPhone,
      aiActionId,
      idempotencyKey,
    } = params;

    // Idempotency check — prevent duplicate orders
    if (idempotencyKey) {
      const existing = await prisma.order.findUnique({
        where: { idempotencyKey },
        include: { payments: true },
      });
      if (existing) {
        return { order: existing, alreadyExists: true };
      }
    }

    // Fetch product with merchant ownership check
    const product = await prisma.product.findFirst({
      where: { id: productId, merchantId },
    });

    if (!product) {
      throw new PaymentError('Product not found', 'PRODUCT_NOT_FOUND');
    }

    if (!product.isActive) {
      throw new PaymentError('Product is not available', 'PRODUCT_INACTIVE');
    }

    if (product.inventory < quantity) {
      throw new PaymentError('Insufficient inventory', 'INSUFFICIENT_INVENTORY');
    }

    const amount = product.price * quantity;
    const receipt = generateReceipt();

    // Get or create customer
    let customer = await prisma.customer.findUnique({
      where: { merchantId_email: { merchantId, email: customerEmail } },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          merchantId,
          email: customerEmail,
          name: customerName,
          phone: customerPhone,
        },
      });
    }

    // Create Razorpay order
    let razorpayOrder;
    try {
      const razorpay = await getRazorpay();
      razorpayOrder = await razorpay.orders.create({
        amount,
        currency: product.currency,
        receipt,
        notes: {
          merchantId,
          productId,
          productName: product.name,
          customerEmail,
          source: 'revolve_ai',
        },
      });
    } catch (error) {
      // If Razorpay times out, don't retry — set unknown state
      throw new PaymentError(
        'Failed to create Razorpay order. Please try again.',
        'RAZORPAY_ERROR',
        error
      );
    }

    // Create order and payment records in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          merchantId,
          customerId: customer!.id,
          razorpayOrderId: razorpayOrder.id,
          status: 'CREATED',
          amount,
          currency: product.currency,
          receipt,
          customerEmail,
          customerName,
          customerPhone,
          aiActionId,
          idempotencyKey,
          items: {
            create: {
              productId: product.id,
              quantity,
              price: product.price,
              name: product.name,
            },
          },
        },
        include: { items: true },
      });

      // Create initial payment record
      await tx.payment.create({
        data: {
          merchantId,
          orderId: newOrder.id,
          razorpayOrderId: razorpayOrder.id,
          status: 'CREATED',
          amount,
          currency: product.currency,
        },
      });

      return newOrder;
    });

    return {
      order,
      razorpayOrderId: razorpayOrder.id,
      amount,
      currency: product.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      alreadyExists: false,
    };
  }

  /**
   * Verify payment signature from Razorpay checkout callback.
   * Never trust frontend success alone.
   */
  static async verifyPayment(params: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    merchantId: string;
  }) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, merchantId } = params;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign)
      .digest('hex');

    if (razorpay_signature !== expectedSignature) {
      throw new PaymentError('Invalid payment signature', 'INVALID_SIGNATURE');
    }

    // Find the order
    const order = await prisma.order.findFirst({
      where: { razorpayOrderId: razorpay_order_id, merchantId },
      include: { payments: true, items: true },
    });

    if (!order) {
      throw new PaymentError('Order not found', 'ORDER_NOT_FOUND');
    }

    // Check for duplicate verification
    const existingPayment = await prisma.payment.findUnique({
      where: { razorpayPaymentId: razorpay_payment_id },
    });

    if (existingPayment && existingPayment.status === 'CAPTURED') {
      return { order, payment: existingPayment, alreadyVerified: true };
    }

    // Update payment and order status
    const payment = await prisma.$transaction(async (tx) => {
      const updatedPayment = await tx.payment.upsert({
        where: { razorpayPaymentId: razorpay_payment_id },
        create: {
          merchantId,
          orderId: order.id,
          razorpayPaymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          razorpaySignature: razorpay_signature,
          status: 'CAPTURED',
          amount: order.amount,
          currency: order.currency,
          verifiedAt: new Date(),
        },
        update: {
          razorpaySignature: razorpay_signature,
          status: 'CAPTURED',
          verifiedAt: new Date(),
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: { status: 'PAID' },
      });

      // Decrease inventory
      for (const item of order.items || []) {
        await tx.product.update({
          where: { id: item.productId },
          data: { inventory: { decrement: item.quantity } },
        });
      }

      return updatedPayment;
    });

    return { order, payment, alreadyVerified: false };
  }

  /**
   * Handle Razorpay timeout: set EXECUTION_UNKNOWN and attempt to resolve.
   */
  static async handleTimeout(orderId: string, merchantId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, merchantId },
      include: { payments: true },
    });

    if (!order) return null;

    // If already in a terminal state, return as-is
    if (['PAID', 'FAILED', 'CANCELLED'].includes(order.status)) {
      return order;
    }

    // Try to fetch order status from Razorpay
    try {
      const razorpay = await getRazorpay();
      if (order.razorpayOrderId) {
        const rzpOrder = await razorpay.orders.fetch(order.razorpayOrderId);
        if (rzpOrder.status === 'paid') {
          await prisma.order.update({
            where: { id: order.id },
            data: { status: 'PAID' },
          });
          return { ...order, status: 'PAID' as const };
        }
      }
    } catch {
      // Can't verify — leave in unknown state
    }

    return order;
  }
}

export class PaymentError extends Error {
  code: string;
  cause?: unknown;

  constructor(message: string, code: string, cause?: unknown) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
    this.cause = cause;
  }
}
