# REVOLVE AI

> **AI that grows your revenue. Safely.**  
> *Production-Grade AI Growth & Agentic Commerce Platform for the Razorpay Hackathon*

---

## 🌟 Executive Summary

**Revolve AI** is a merchant revenue optimization and agentic commerce engine built with a non-negotiable safety principle: **AI must NEVER directly control money.**

Traditional automated systems risk runaway charges, hallucinations, and unverified transactions. Revolve AI introduces a deterministic, policy-bounded architecture where AI recommendations are cryptographically auditable, evaluated against merchant safety limits, gated by human-in-the-loop approvals, executed through **Razorpay Test Mode**, verified via HMAC-SHA256 signatures, and reconciled with idempotent webhook processing into an immutable ledger.

---

## 🏗️ Architecture & Core Safety Flow

```
Merchant Catalog & Orders
         │
         ▼
 🧠 AI Growth Agent ──────▶ Discovers Upsell / Cross-sell / Campaign / Pricing Opportunities
         │
         ▼
 📋 Structured Zod Validation ─▶ Rejects malformed or out-of-bounds proposals
         │
         ▼
 🛡️ Policy Engine ───────▶ Enforces max transaction cap (₹10,000), daily spend limits, discount caps
         │
         ▼
 👤 Human-in-the-Loop ───▶ Merchant reviews & explicitly authorizes high-impact actions
         │
         ▼
 ⚡ Execution Service ────▶ Bounded purchase or campaign trigger
         │
         ▼
 💳 Razorpay Test Mode ──▶ Creates secure Razorpay Order (`order_xxxx`)
         │
         ▼
 🖥️ Razorpay Checkout ───▶ Customer completes checkout via standard Razorpay modal
         │
         ▼
 🔐 Server Verification ─▶ Backend verifies HMAC-SHA256 signature (`order_id|payment_id`)
         │
         ▼
 🪝 Webhook Reconciliation ▶ Idempotent, deduplicated webhook confirms capture (`payment.captured`)
         │
         ▼
 🗄️ PostgreSQL + Prisma ─▶ Updates order state, inventory, and analytics
         │
         ▼
 📜 Immutable Audit Trail ▶ Permanent cryptographic record of the full decision lifecycle
```

---

## 🚀 Key Product Differentiators

| Feature | Description |
| :--- | :--- |
| **Explainable AI** | Every recommendation provides: *What*, *Why*, *Evidence*, *Projected Monthly Revenue Impact*, and *Risk Assessment*. |
| **Bounded Execution** | AI cannot execute arbitrary financial code. All actions must conform to validated state machine transitions (`PROPOSED` → `POLICY_CHECK` → `AWAITING_APPROVAL` → `APPROVED` → `EXECUTING` → `SUCCESS`). |
| **Fintech Policy Engine** | Merchants define custom parameters: maximum transaction amount, daily spend ceiling, maximum discount %, and action allowlists. |
| **Agentic AI Buyer** | AI buyer agent searches the product catalog via natural language, compares features, explains selections, and triggers bounded checkout. |
| **Razorpay Test Mode Integration** | Real order creation, standard client checkout modal, HMAC-SHA256 signature verification, and webhook event deduplication. |
| **Idempotency & Failure Safe** | If Razorpay times out, state enters `EXECUTION_UNKNOWN` and polls/verifies existing orders before retrying, preventing double charges. |
| **Immutable Audit Trail** | Append-only audit records tracking every recommendation, policy check, merchant decision, payment capture, and webhook event. |
| **Fintech Design System** | Engineered with *Plus Jakarta Sans*, *Inter*, and *JetBrains Mono*, dark mode support, and Framer Motion micro-interactions. |

---

## 💻 Technology Stack

* **Framework**: Next.js 16 (App Router, Server Components & Route Handlers)
* **Language**: TypeScript 5
* **Styling**: Tailwind CSS v4 + Vanilla Design System (CSS custom properties, HSL color tokens)
* **Database & ORM**: PostgreSQL 16 + Prisma ORM v6
* **Authentication**: Password hashing with `bcryptjs` (12 rounds) + HTTP-only, Secure, SameSite JWT cookies
* **Payment Gateway**: Razorpay Test Mode SDK (`razorpay` Node.js package + Standard Checkout JS)
* **Validation**: Zod 3/4 runtime schemas
* **Animations**: Framer Motion
* **Charts**: Recharts with responsive SVG area gradients
* **Icons**: Lucide React
* **Testing**: Vitest unit & integration test runner

---

## 🗃️ Database Architecture (Prisma Models)

The relational schema strictly enforces tenant isolation with `merchantId` foreign keys and composite indexes across 18 models:

* `User`: Merchant admin authentication and session management.
* `Merchant`: Multi-tenant root organization entity.
* `Product` & `ProductVariant`: Catalog items with AI metadata, tags, and cross-sell relationships.
* `Customer`: Merchant customer cohort records.
* `Order` & `OrderItem`: Purchase records with `razorpayOrderId` and `idempotencyKey`.
* `Payment`: Razorpay payment details, capture timestamps, and HMAC signatures.
* `AIRecommendation`: Explainable revenue opportunities discovered by the AI Engine.
* `AIAgentAction`: State machine actions with policy evaluation results.
* `Approval`: Human-in-the-loop authorization gates with expiration tracking.
* `Campaign`: Promotional campaigns with budget tracking and discount limits.
* `WebhookEvent`: Razorpay webhook store with unique `eventId` for deduplication.
* `AuditEvent`: Append-only, immutable governance log.
* `AgentPolicy`: Safety limits and authorization thresholds.
* `AIBuyerSession` & `AIBuyerRequest`: Agentic buyer chat histories and product recommendations.
* `Notification`: In-app notification alerts.

---

## ⚡ Local Setup Guide

### 1. Prerequisites
* Node.js 20+
* Docker & Docker Compose (or an external PostgreSQL instance)

### 2. Clone and Install
```bash
git clone <repo-url>
cd revolve-ai
npm install
```

### 3. Environment Variables
Create `.env` from the template:
```bash
cp .env.example .env
```

Fill in your configuration:
```env
# PostgreSQL
DATABASE_URL="postgresql://revolve:revolve_dev_password@localhost:5432/revolve_ai?schema=public"

# Authentication
AUTH_SECRET="your-secure-jwt-auth-secret-minimum-32-chars-long"

# Razorpay (Test Mode)
RAZORPAY_KEY_ID="rzp_test_your_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
RAZORPAY_WEBHOOK_SECRET="your_razorpay_webhook_secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_your_key_id"

# AI Provider (Deterministic engine by default; pluggable for Gemini/OpenAI)
AI_PROVIDER="deterministic"
AI_API_KEY=""

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 4. Start Local PostgreSQL Database
```bash
docker-compose up -d
```

### 5. Run Database Migrations & Seed
```bash
# Push schema to PostgreSQL
npx prisma db push

# Seed realistic products, orders, AI recommendations, and audit logs
npx tsx prisma/seed.ts
```

### 6. Run the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔑 Demo Evaluator Credentials

When the database is seeded, log in at `/login` using the evaluator credentials:

* **Email**: `admin@apexgear.io`
* **Password**: `DemoMerchant@2026`
*(Or click the "Auto-fill" button on the sign-in screen)*

---

## 🧪 Testing

Run the automated test suite with Vitest:
```bash
npm test
```

### Test Coverage Highlights:
* **Policy Engine**: Validates transaction caps, discount limits, blocked action types, and daily spend ceilings.
* **Cryptographic Signatures**: Tests Razorpay HMAC-SHA256 signature verification and tamper detection.
* **Zod Validation**: Verifies strict parsing of structured AI recommendations and user inputs.
* **State Machine Transitions**: Ensures invalid status transitions are rejected.

---

## 💳 Razorpay Test Mode & Webhook Configuration

### Setting up Razorpay Webhook
1. In your Razorpay Dashboard, navigate to **Settings → Webhooks**.
2. Click **Add New Webhook**.
3. **Webhook URL**: `https://your-domain.com/api/webhooks/razorpay` (or your ngrok URL for local dev).
4. **Secret**: Enter the value matching `RAZORPAY_WEBHOOK_SECRET` in `.env`.
5. **Active Events**:
   * `payment.captured`
   * `payment.failed`
   * `payment.authorized`
   * `order.paid`
6. Revolve AI automatically verifies signatures using raw request buffers and deduplicates events using the unique Razorpay `event_id`.

---

## 🛡️ Security Architecture

* **Tenant Isolation**: Every merchant-scoped query enforces `merchantId` derived exclusively from verified session cookies.
* **Password Security**: Passwords hashed with `bcryptjs` using 12 salt rounds.
* **Cookie Protection**: JWT session tokens stored in `httpOnly`, `secure`, `sameSite=lax` cookies.
* **Rate Limiting**: In-memory token bucket rate limiters protect `/api/auth/*`, `/api/orders`, and `/api/ai/*`.
* **Zero Secrets in Frontend**: Razorpay Key Secret and Auth Secrets are strictly isolated to server-side route handlers.

---

## 📄 License & Attribution

Built for the **Razorpay Hackathon 2026**.  
Engineered with precision for real-world merchant revenue growth.
