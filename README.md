# 🏺 Scentence

> A premium fragrance e-commerce platform featuring a meticulously curated archive of essence, avant-garde originals, and timeless master compositions.

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
| **Admin** | View all orders, update status, delete orders, export data, print shipping labels | `/admin` |

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
| **Database** | Supabase | PostgreSQL storage with Realtime capabilities |
| **Email** | Resend | Transactional email delivery |
| **Components** | Radix UI | Accessible UI primitives |
| **Documents** | jsPDF / XLSX | Professional report and label generation |

---

## 📁 Project Structure

```
scentance/
├── src/
│   ├── app/                # Next.js App Router (Admin, Login, Perfumes)
│   ├── components/         # React components (UI, Admin, Emails)
│   │   ├── admin/         # Order management components
│   │   ├── emails/        # React Email templates
│   │   └── ui/            # Reusable UI primitives
│   ├── lib/                # Core logic
│   │   ├── supabase/      # Database client/server setup
│   │   ├── store/         # State management (Zustand/Cart)
│   │   ├── hooks/         # Custom hooks (useProducts)
│   │   └── actions.tsx    # Server Actions for DB/Email
└── public/                 # Static assets (Fonts, Images)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **Supabase Account** (Database & Auth)
- **Resend Account** (For transactional emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/scentance.git
   cd scentance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   RESEND_API_KEY=your_resend_api_key
   ```

4. **Database Setup**
   Run the following in your Supabase SQL Editor to create the necessary schema:
   - Create `products` table (id, name, category, notes, price, image)
   - Create `orders` table (id, customer_name, email, phone, address, city, state, pincode, status, total_amount)
   - Create `order_items` table (id, order_id, product_id, product_name, product_price, quantity)

5. **Start Development**
   ```bash
   npm run dev
   ```

---

## 🔧 Database Schema

| Table | Description |
|-------|-------------|
| `products` | The master archive of fragrances and their profiles. |
| `orders` | Customer order details, shipping info, and status. |
| `order_items` | Individual line items linked to each order. |

---

**Built with ❤️ for the world of Olfactory Art**
