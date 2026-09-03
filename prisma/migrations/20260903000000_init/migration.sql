-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ActionStatus" AS ENUM ('PROPOSED', 'POLICY_CHECK', 'AWAITING_APPROVAL', 'APPROVED', 'EXECUTING', 'SUCCESS', 'FAILED', 'REJECTED', 'EXPIRED', 'EXECUTION_UNKNOWN');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('UPSELL', 'CROSS_SELL', 'CAMPAIGN', 'PRICING', 'BUNDLE', 'DISCOUNT', 'AI_PURCHASE');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('CREATED', 'ATTEMPTED', 'PAID', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'PROPOSED', 'AWAITING_APPROVAL', 'APPROVED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RecommendationType" AS ENUM ('UPSELL', 'CROSS_SELL', 'CAMPAIGN', 'PRICING', 'BUNDLE', 'CONVERSION');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('OPPORTUNITY', 'APPROVAL_REQUIRED', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'CAMPAIGN_UPDATE', 'AI_ANALYSIS', 'SYSTEM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'merchant_admin',
    "merchantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Merchant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "businessName" TEXT,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "shortDescription" TEXT,
    "price" INTEGER NOT NULL,
    "compareAtPrice" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "category" TEXT,
    "sku" TEXT,
    "inventory" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "imageUrl" TEXT,
    "features" TEXT[],
    "tags" TEXT[],
    "aiMetadata" JSONB,
    "upsellProductIds" TEXT[],
    "crossSellProductIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "price" INTEGER NOT NULL,
    "inventory" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "attributes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "customerId" TEXT,
    "razorpayOrderId" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'CREATED',
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "receipt" TEXT,
    "customerEmail" TEXT,
    "customerName" TEXT,
    "customerPhone" TEXT,
    "notes" JSONB,
    "aiActionId" TEXT,
    "idempotencyKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "razorpayPaymentId" TEXT,
    "razorpayOrderId" TEXT,
    "razorpaySignature" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'CREATED',
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "method" TEXT,
    "errorCode" TEXT,
    "errorDescription" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "webhookConfirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIRecommendation" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "type" "RecommendationType" NOT NULL,
    "title" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "evidence" TEXT[],
    "expectedImpact" INTEGER NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'LOW',
    "productId" TEXT,
    "targetProductIds" TEXT[],
    "metadata" JSONB,
    "isProcessed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIAgentAction" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "recommendationId" TEXT,
    "type" "ActionType" NOT NULL,
    "status" "ActionStatus" NOT NULL DEFAULT 'PROPOSED',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "amount" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'LOW',
    "policyResult" JSONB,
    "executionResult" JSONB,
    "errorMessage" TEXT,
    "idempotencyKey" TEXT,
    "metadata" JSONB,
    "expiresAt" TIMESTAMP(3),
    "executedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIAgentAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Approval" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "approvedBy" TEXT,
    "rejectedBy" TEXT,
    "reason" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Approval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "targetAudience" TEXT,
    "discountPercent" DOUBLE PRECISION,
    "budget" INTEGER,
    "spent" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "isAiGenerated" BOOLEAN NOT NULL DEFAULT false,
    "aiActionId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "signature" TEXT,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "reason" TEXT,
    "metadata" JSONB,
    "requestId" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentPolicy" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "maximumTransactionAmount" INTEGER NOT NULL DEFAULT 1000000,
    "dailySpendLimit" INTEGER NOT NULL DEFAULT 5000000,
    "maximumCampaignBudget" INTEGER NOT NULL DEFAULT 2000000,
    "maximumDiscountPercentage" DOUBLE PRECISION NOT NULL DEFAULT 25.0,
    "requireMerchantApproval" BOOLEAN NOT NULL DEFAULT true,
    "allowedActions" TEXT[] DEFAULT ARRAY['UPSELL', 'CROSS_SELL', 'CAMPAIGN']::TEXT[],
    "blockedActions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIBuyerSession" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "buyerName" TEXT,
    "buyerEmail" TEXT,
    "context" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIBuyerSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIBuyerRequest" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userMessage" TEXT NOT NULL,
    "aiResponse" JSONB NOT NULL,
    "productIds" TEXT[],
    "selectedProductId" TEXT,
    "orderId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIBuyerRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "entityId" TEXT,
    "entityType" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_merchantId_idx" ON "User"("merchantId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_email_key" ON "Merchant"("email");

-- CreateIndex
CREATE INDEX "Product_merchantId_idx" ON "Product"("merchantId");

-- CreateIndex
CREATE INDEX "Product_merchantId_category_idx" ON "Product"("merchantId", "category");

-- CreateIndex
CREATE INDEX "Product_merchantId_isActive_idx" ON "Product"("merchantId", "isActive");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE INDEX "Customer_merchantId_idx" ON "Customer"("merchantId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_merchantId_email_key" ON "Customer"("merchantId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Order_razorpayOrderId_key" ON "Order"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_receipt_key" ON "Order"("receipt");

-- CreateIndex
CREATE UNIQUE INDEX "Order_idempotencyKey_key" ON "Order"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Order_merchantId_idx" ON "Order"("merchantId");

-- CreateIndex
CREATE INDEX "Order_merchantId_status_idx" ON "Order"("merchantId", "status");

-- CreateIndex
CREATE INDEX "Order_merchantId_createdAt_idx" ON "Order"("merchantId", "createdAt");

-- CreateIndex
CREATE INDEX "Order_razorpayOrderId_idx" ON "Order"("razorpayOrderId");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_razorpayPaymentId_key" ON "Payment"("razorpayPaymentId");

-- CreateIndex
CREATE INDEX "Payment_merchantId_idx" ON "Payment"("merchantId");

-- CreateIndex
CREATE INDEX "Payment_merchantId_status_idx" ON "Payment"("merchantId", "status");

-- CreateIndex
CREATE INDEX "Payment_razorpayPaymentId_idx" ON "Payment"("razorpayPaymentId");

-- CreateIndex
CREATE INDEX "Payment_razorpayOrderId_idx" ON "Payment"("razorpayOrderId");

-- CreateIndex
CREATE INDEX "AIRecommendation_merchantId_idx" ON "AIRecommendation"("merchantId");

-- CreateIndex
CREATE INDEX "AIRecommendation_merchantId_type_idx" ON "AIRecommendation"("merchantId", "type");

-- CreateIndex
CREATE INDEX "AIRecommendation_merchantId_isProcessed_idx" ON "AIRecommendation"("merchantId", "isProcessed");

-- CreateIndex
CREATE INDEX "AIRecommendation_merchantId_createdAt_idx" ON "AIRecommendation"("merchantId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AIAgentAction_idempotencyKey_key" ON "AIAgentAction"("idempotencyKey");

-- CreateIndex
CREATE INDEX "AIAgentAction_merchantId_idx" ON "AIAgentAction"("merchantId");

-- CreateIndex
CREATE INDEX "AIAgentAction_merchantId_status_idx" ON "AIAgentAction"("merchantId", "status");

-- CreateIndex
CREATE INDEX "AIAgentAction_merchantId_type_idx" ON "AIAgentAction"("merchantId", "type");

-- CreateIndex
CREATE INDEX "AIAgentAction_merchantId_createdAt_idx" ON "AIAgentAction"("merchantId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Approval_actionId_key" ON "Approval"("actionId");

-- CreateIndex
CREATE INDEX "Approval_merchantId_idx" ON "Approval"("merchantId");

-- CreateIndex
CREATE INDEX "Approval_merchantId_status_idx" ON "Approval"("merchantId", "status");

-- CreateIndex
CREATE INDEX "Campaign_merchantId_idx" ON "Campaign"("merchantId");

-- CreateIndex
CREATE INDEX "Campaign_merchantId_status_idx" ON "Campaign"("merchantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_eventId_key" ON "WebhookEvent"("eventId");

-- CreateIndex
CREATE INDEX "WebhookEvent_eventId_idx" ON "WebhookEvent"("eventId");

-- CreateIndex
CREATE INDEX "WebhookEvent_eventType_idx" ON "WebhookEvent"("eventType");

-- CreateIndex
CREATE INDEX "WebhookEvent_processed_idx" ON "WebhookEvent"("processed");

-- CreateIndex
CREATE INDEX "AuditEvent_merchantId_idx" ON "AuditEvent"("merchantId");

-- CreateIndex
CREATE INDEX "AuditEvent_merchantId_action_idx" ON "AuditEvent"("merchantId", "action");

-- CreateIndex
CREATE INDEX "AuditEvent_merchantId_createdAt_idx" ON "AuditEvent"("merchantId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditEvent_entityId_idx" ON "AuditEvent"("entityId");

-- CreateIndex
CREATE INDEX "AuditEvent_requestId_idx" ON "AuditEvent"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "AgentPolicy_merchantId_key" ON "AgentPolicy"("merchantId");

-- CreateIndex
CREATE INDEX "AIBuyerSession_merchantId_idx" ON "AIBuyerSession"("merchantId");

-- CreateIndex
CREATE INDEX "AIBuyerSession_merchantId_status_idx" ON "AIBuyerSession"("merchantId", "status");

-- CreateIndex
CREATE INDEX "AIBuyerRequest_sessionId_idx" ON "AIBuyerRequest"("sessionId");

-- CreateIndex
CREATE INDEX "Notification_merchantId_idx" ON "Notification"("merchantId");

-- CreateIndex
CREATE INDEX "Notification_merchantId_isRead_idx" ON "Notification"("merchantId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_merchantId_createdAt_idx" ON "Notification"("merchantId", "createdAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIRecommendation" ADD CONSTRAINT "AIRecommendation_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIRecommendation" ADD CONSTRAINT "AIRecommendation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIAgentAction" ADD CONSTRAINT "AIAgentAction_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIAgentAction" ADD CONSTRAINT "AIAgentAction_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "AIRecommendation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "AIAgentAction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookEvent" ADD CONSTRAINT "WebhookEvent_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentPolicy" ADD CONSTRAINT "AgentPolicy_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIBuyerSession" ADD CONSTRAINT "AIBuyerSession_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIBuyerRequest" ADD CONSTRAINT "AIBuyerRequest_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AIBuyerSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

