# 🚀 AI-BOS (Artificial Intelligence Business Operating System)

AI-BOS is a next-generation, multi-tenant Business Operating System designed to autonomously run small to medium-sized businesses. It replaces traditional ERPs with a modern, beautifully designed interface, an immutable accounting ledger, and a deterministic "Local AI CEO" that actively monitors your business health, inventory, and finances to provide actionable insights.

---

## ✨ Key Features
- **🤖 Local AI CEO:** A deterministic intelligence engine that queries your business data in real-time to alert you of low stock, financial anomalies, and operational inefficiencies—all without relying on external APIs.
- **🏢 Multi-Tenant Architecture:** Built from the ground up for massive scale. Every query and data point is strictly isolated to its respective `businessId`.
- **📦 Advanced Inventory Management:** Handles warehouses, multi-level categories, suppliers, and stock tracking.
- **🔒 Immutable Ledgers:** Stock levels and financial balances are never stored as mutable integers. They are strictly calculated dynamically from an append-only `InventoryMovement` and `JournalLine` ledger to prevent data corruption.
- **⚡ Blazing Fast UI:** Built on Next.js 15 App Router and React Server Components for instant navigation and data fetching.

---

## 🛠️ Tech Stack
- **Frontend Framework:** Next.js 15 (App Router, Server Actions)
- **Styling:** Tailwind CSS & Lucide Icons (Glassmorphism & Dark Mode)
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Prisma
- **Deployment:** Vercel

---

## 📚 Official Documentation
Want to learn how the system works or how to present it? Check out our official documentation:
- 📘 [AI-BOS for Beginners](./docs/AI-BOS_for_Beginners.md) - The step-by-step training manual.
- 📖 [User Manual](./docs/AI-BOS_User_Manual.md) - Comprehensive breakdown of all modules.
- 🏗️ [Architecture Guide](./docs/AI-BOS_Architecture.md) - How the immutable ledger and database work.
- 🎤 [Demo Script](./docs/AI-BOS_Demo_Script.md) - A 10-minute presentation guide.
- ⚡ [Quick Start](./docs/AI-BOS_Quick_Start.md) - 2-minute checklist to populate your database.

---

## 💻 How to Work on It (Local Setup)

To run the AI-BOS environment on your local machine, follow these steps:

### 1. Clone the Repository
```bash
git clone https://github.com/EternalAeonic/ai-bos.git
cd ai-bos
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a file named `.env.local` in the root folder and add your Neon Postgres database URL and a random 32-character secret string for authentication:
```env
POSTGRES_URL="postgresql://user:password@hostname.neon.tech/neondb?sslmode=require"
BETTER_AUTH_SECRET="your-super-secret-32-character-key-here"
```

### 4. Push the Database Schema
This will synchronize your Prisma schema with your PostgreSQL database:
```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🗺️ Future Plan & Roadmap

AI-BOS is being developed in aggressive, feature-complete sprints.

✅ **Sprint 1-3 (Foundation):** Multi-tenant DB, soft deletes, audit logging, Next.js architecture.
✅ **Sprint 4 (Business Profile):** Onboarding wizard, org setup, locations, employees.
✅ **Sprint 5-9 (Inventory):** Warehouses, Product management, Immutable Movements ledger.
✅ **Sprint 10 (Local AI CEO):** Deterministic AI business health monitor.
🚀 **Sprint 11 (Purchasing):** Supplier orders, PO management, and automated reordering.
🚀 **Sprint 12 (Finance):** Double-entry accounting, General Ledger, and trial balance.
🚀 **Sprint 13 (Cloud AI):** Swapping the deterministic AI brain with Gemini/OpenAI for advanced natural language processing.
