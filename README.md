# 🏺 Scentence

> A premium fragrance e-commerce platform featuring a meticulously curated archive of essence, avant-garde originals, and timeless master compositions.

**Live Demo:** [scentenceparfum.com](https://www.scentenceparfum.com/)

Scentence is a modern digital flagship for premium perfumery. It combines a sophisticated, minimal aesthetic with robust e-commerce functionality, providing a seamless journey from olfactory discovery to secure checkout and order management.

---

## ✨ What Does Scentence Do?

**In simple terms:** Scentence provides an elegant interface for customers to browse premium fragrances, learn about their unique notes, and purchase them through a streamlined checkout process, while giving administrators a powerful portal to manage orders and logistics.

### The Experience It Delivers

- **🏺 Curated Discovery** - Browse a high-end gallery of perfumes with detailed olfactory notes.
- **🛒 Effortless Shopping** - A modern cart system with smooth animations and persistent state.
- **🔐 Secure Checkout** - Comprehensive shipping and contact information gathering.
- **📧 Automated Communication** - Instant order receipts and confirmation emails via Resend.
- **📊 Admin Command Center** - Professional dashboard for tracking revenue, managing order status, and exporting data.

---

## 🚀 Key Features

### 🖥️ Admin Portal (Command Center)
- **Real-time Order Tracking** - Monitor new orders as they arrive with live status updates.
- **Revenue Analytics** - Instant visibility into confirmed revenue and order volume.
- **Advanced Exporting** - Export order data to **CSV, Excel, or PDF** for bookkeeping and logistics.
- **Shipping Logistics** - Generate professional **PDF Shipping Labels** with a single click.
- **Order Lifecycle Management** - Transition orders from Pending → Confirmed → Shipped.

### 🏺 Premium Storefront
- **Curated Product Gallery** - Visually stunning display of the perfume archive.
- **Olfactory Details** - Every fragrance listed with its specific composition and notes.
- **Interactive Mesh Background** - A modern, fluid UI aesthetic using Three.js/React Three Fiber.
- **Responsive Design** - Fully optimized for mobile, tablet, and desktop browsing.

### 🛒 Seamless Checkout Flow
- **Cart Management** - Sliding drawer interface for quick access to selections.
- **Validation-Rich Forms** - Secure gathering of shipping and contact details.
- **Instant Email Receipts** - Customers receive beautifully branded emails immediately after purchase.
- **Status Communication** - Automated notifications when orders are confirmed by the admin.

---

## 👤 User Roles & Access

| Role | What They Can Do | Dashboard |
|------|------------------|-----------|
| **Customer** | Browse perfumes, manage cart, place orders, receive email updates | `/` |
| **Admin** | View all orders, update status, delete orders, export data, print shipping labels | `/dashboard` |

---

## 🏗️ How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    CUSTOMER JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

   STOREFRONT              CART & CHECKOUT              FULFILLMENT
   ┌──────────┐            ┌──────────┐            ┌──────────────┐
   │  BROWSE  │───────────▶│  SECURE  │───────────▶│    ORDER     │
   │ ARCHIVE  │  select    │ CHECKOUT │  process   │  CONFIRMED   │
   └──────────┘            └──────────┘            └──────────────┘
        │                        │                        │
        │                        ▼                        ▼
        │             ┌────────────────────┐    ┌──────────────────┐
        │             │  SUPABASE DB       │    │  RESEND EMAIL    │
        │             │  (Orders Table)    │    │  (Notification)  │
        └─────────────┴────────────────────┴────┴──────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN PORTAL                                 │
└─────────────────────────────────────────────────────────────────┘

   All sales flow into the Admin Dashboard:
   • Status management (Pending/Confirmed/Shipped)
   • Revenue tracking (Automated calculations)
   • Data Export (CSV/Excel/PDF)
   • Shipping Label generation
```

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | Next.js 16 | React framework with App Router & Server Actions |
| **Language** | TypeScript 5 | Type-safe development |
| **Styling** | Tailwind CSS 4 | Modern utility-first CSS |
| **Visuals** | Three.js / R3F | High-end 3D mesh backgrounds |
| **Animation** | Framer Motion | Smooth UI transitions and interactions |
| **Database** | Cloudflare D1 | SQLite at the edge, queried through Drizzle ORM |
| **Auth** | Better Auth | Email/password sessions stored in D1 |
| **Storage** | GitHub + jsDelivr | Admin product images are committed to `public/product-images/` |
| **Hosting** | Cloudflare Workers | Next.js via `@opennextjs/cloudflare` |
| **Email** | Resend | Transactional email delivery |
| **Components** | Radix UI | Accessible UI primitives |
| **Documents** | jsPDF / XLSX | Professional report and label generation |

---

## 📁 Project Structure

```
scentance/
├── src/
│   ├── app/                # Next.js App Router (Dashboard, Login, Perfumes)
│   ├── components/         # React components (UI, Dashboard, Emails)
│   │   ├── dashboard/     # Order management components
│   │   ├── emails/        # React Email templates
│   │   └── ui/            # Reusable UI primitives
│   ├── lib/                # Core logic
│   │   ├── auth-context.tsx # Client auth provider (Better Auth)
│   │   ├── auth-server.ts # Better Auth instance + Drizzle adapter
│   │   ├── store/         # State management (Zustand/Cart)
│   │   ├── hooks/         # Custom hooks (useProducts)
│   │   └── actions.tsx    # Server Actions for DB/Email
│   └── db/                # Drizzle schema + D1 client
├── drizzle/                # Generated D1 migrations
├── wrangler.jsonc          # Worker, D1 and R2 bindings
└── public/                 # Static assets (Fonts, Images)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 22.18 or higher (required by `cf`/OpenNext)
- **Cloudflare account** with a Worker and a D1 database
- **Resend account** (transactional email)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cendra-softwares/scentance.git
   cd scentance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Authenticate wrangler**
   ```bash
   npx wrangler login
   npx wrangler whoami   # confirm the account from wrangler.jsonc
   ```

4. **Create the D1 database and apply migrations**
   ```bash
   npx wrangler d1 create scentance-db   # copy the id into wrangler.jsonc
   npm run db:migrate
   ```

5. **Set local secrets**
   ```bash
   cp .dev.vars.example .dev.vars   # fill BETTER_AUTH_SECRET, RESEND_API_KEY, PHONEPE_*
   ```

6. **Image uploads**

   Product images are committed to this repository under
   `public/product-images/products/` through the GitHub Contents API and served
   from jsDelivr (pinned to the commit SHA), so no object-store subscription is
   needed. Set `GITHUB_TOKEN` (fine-grained PAT with **Contents: read and write**
   on this repo) as a Worker secret; `GITHUB_REPO` lives in `wrangler.jsonc`.

7. **Seed the admin account**
   ```bash
   ADMIN_PASSWORD='<at-least-12-chars>' node scripts/seed-admin.mjs
   npx wrangler d1 execute scentance-db --remote --file=.tmp/seed-admin.sql
   ```

8. **Start development**
   ```bash
   npm run dev      # next dev, with D1/R2 bindings from wrangler.jsonc
   npm run preview  # built Worker in workerd
   npm run deploy   # build + deploy to Cloudflare Workers
   ```

Production secrets are set once per Worker:
```bash
npx wrangler secret put BETTER_AUTH_SECRET
npx wrangler secret put GITHUB_TOKEN      # fine-grained PAT, Contents: read and write
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put PHONEPE_CLIENT_ID
npx wrangler secret put PHONEPE_CLIENT_SECRET
```

### Schema changes

Edit `src/db/schema.ts`, then:
```bash
npm run db:generate   # drizzle-kit generate -> drizzle/
npm run db:migrate    # wrangler d1 migrations apply --remote
```

---

## 🔧 Database Schema

| Table | Description |
|-------|-------------|
| `products` | The master archive of fragrances and their profiles. |
| `categories`, `product_templates`, `product_variants`, `attribute_definitions`, `variant_attribute_values` | Normalized catalog (side-by-side with `products`). |
| `orders`, `order_items` | Customer orders, shipping info, status and line items. |
| `profiles` | Role per user (`admin` / `customer`), linked to `user`. |
| `guest_sessions` | Guest checkout tokens (cookie-backed, 30 day expiry). |
| `audit_logs`, `contact_messages` | Admin audit trail and contact form submissions. |
| `user`, `session`, `account`, `verification` | Better Auth core tables. |

---

**Built with ❤️ for the world of Olfactory Art**
