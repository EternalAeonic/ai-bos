# AI-BOS Complete User Manual

## Part 1 – System Overview

**What is AI-BOS?**
AI-BOS (AI Business Operating System) is a next-generation ERP and operational platform designed for modern businesses. Unlike traditional ERPs that require manual data digging, AI-BOS features an integrated AI CEO that actively monitors your business, analyzes your inventory, and provides actionable insights.

**Main Architecture**
AI-BOS is built on a highly modular, event-driven architecture using Next.js, Prisma (PostgreSQL), and specialized Domain Services.
- **Frontend**: A dark-mode, glassmorphic UI built with React and Tailwind CSS.
- **Backend Services**: Domain-specific classes (e.g., `StockCalculationService`, `InventoryMovementService`) that enforce business rules.
- **AI Engine**: A local deterministic rule engine (`BusinessAnalysisService`) that parses live data to generate health scores, warnings, and recommendations without relying on external APIs.

**Main Modules (Current Implementation)**
1. **Dashboard**: The central hub featuring the AI CEO panel, business snapshot, and recent activity.
2. **Inventory**: The core operational module managing Warehouses, Categories, Products, Suppliers, and Stock Movements.
3. **Onboarding**: A setup wizard to configure initial business parameters.

How they connect: The Onboarding wizard establishes the business. The Inventory module populates the database with products and stock. The Dashboard reads this live data to provide real-time AI intelligence.

---

## Part 2 – Complete User Manual

### Dashboard & AI CEO
**Purpose:** Provides a high-level overview of business health and AI-driven recommendations.
**Navigation:** Sidebar > Dashboard
**Actions:**
- View "Business Snapshot" (Setup completion, Health).
- View "Recent Activity".
- **AI CEO Panel**: Displays "Today's Brief" (Warnings and Recommendations based on stock levels).
- **Quick Questions**: Click predefined buttons (e.g., "How is my business?") to get instant AI analysis.

### Inventory -> Warehouses
**Purpose:** Manage physical storage locations.
**Navigation:** Sidebar > Inventory > Warehouses
**Forms & Actions:**
- **Add Warehouse**: Click "New Warehouse", enter Name and Location, click "Save".
- **Expected Result**: The new warehouse appears in the list and is available for stock movements.

### Inventory -> Categories
**Purpose:** Group products logically.
**Navigation:** Sidebar > Inventory > Categories
**Forms & Actions:**
- **Add Category**: Click "New Category", enter Name and Description.
- **Expected Result**: Categories can now be assigned to products.

### Inventory -> Suppliers
**Purpose:** Manage vendors who provide products.
**Navigation:** Sidebar > Inventory > Suppliers
**Forms & Actions:**
- **Add Supplier**: Click "New Supplier", enter Name, Contact Name, Email, Phone.
- **Expected Result**: Supplier is created and ready for future Purchase Orders.

### Inventory -> Products
**Purpose:** Manage the items you sell or track.
**Navigation:** Sidebar > Inventory > Products
**Forms & Actions:**
- **Add Product**: Click "New Product".
- **Required Data**: Name, SKU, Category, Price, Cost, Reorder Level.
- **Expected Result**: Product is created. Note: Initial stock must be added via "Adjustments" or "Movements".

### Inventory -> Adjustments (Stock Movements)
**Purpose:** Add, remove, or transfer stock.
**Navigation:** Sidebar > Inventory > Adjustments
**Forms & Actions:**
- **New Adjustment**: Select Type (RECEIPT, ADJUSTMENT, DAMAGE), Select Product, Select Warehouse, Enter Quantity and Notes.
- **Expected Result**: A new `InventoryMovement` record is created. The `StockCalculationService` dynamically updates the available stock for that product.

*(Note: Finance, Purchases, Customers, Employees, Reports, and Settings modules are currently visible in the sidebar but are placeholders for future sprints.)*

---

## Part 3 – Step-By-Step Demo Guide

**Step 1: Login / Dashboard Entry**
- Action: Open the application (redirects to `/dashboard` via bypass).
- Expected Result: The main Dashboard opens, showing the AI CEO initializing.

**Step 2: Create Warehouse**
- Action: Navigate to Inventory > Warehouses. Click "New Warehouse". Enter "Main Distribution Hub" and "New York". Click Save.
- Expected Result: Toast notification confirms creation. Warehouse appears in the list.

**Step 3: Create Category**
- Action: Navigate to Inventory > Categories. Click "New Category". Enter "Electronics". Click Save.
- Expected Result: Category is saved and listed.

**Step 4: Create Supplier**
- Action: Navigate to Inventory > Suppliers. Click "New Supplier". Enter "Techtronics Inc". Click Save.
- Expected Result: Supplier is registered.

**Step 5: Create Product**
- Action: Navigate to Inventory > Products. Click "New Product". Enter "Wireless Mouse", SKU "WM-01", select "Electronics", set Reorder Level to "50". Click Save.
- Expected Result: Product is created with 0 initial stock.

**Step 6: Receive Initial Stock**
- Action: Navigate to Inventory > Adjustments. Click "New Adjustment". Type: "RECEIPT". Select "Wireless Mouse", Select "Main Distribution Hub". Quantity: "100". Save.
- Expected Result: Stock for "WM-01" becomes 100.

**Step 7: Check AI Intelligence**
- Action: Navigate back to the Dashboard.
- Expected Result: The AI CEO updates the Business Health Score and recognizes that stock is adequate.
- Action: Create another product with 0 stock and a reorder level of 10. Go back to Dashboard.
- Expected Result: AI CEO issues a "CRITICAL" warning: "1 products are completely out of stock."

---

## Part 4 – End-to-End Business Flow

**Business Registration:** The user completes the Onboarding wizard to set up the business profile.
↓
**Infrastructure Setup:** The user creates Warehouses, Categories, and Suppliers to establish the operational foundation.
↓
**Product Catalog:** The user defines the Products they sell, including critical thresholds like `reorderLevel`.
↓
**Stock Receipt:** Goods are received into the warehouse via the Adjustments (Movements) page.
↓
**Inventory Management:** Stock levels are dynamically calculated. If stock drops below the `reorderLevel`, it is flagged.
↓
**AI Intelligence:** The BusinessAnalysisService continuously monitors the StockCalculationService. It detects low stock and immediately surfaces a warning on the Dashboard via the AI CEO Panel.
*(Future Flow: AI generates a Purchase Request -> Approval -> Purchase Order -> Finance Updated).*

---

## Part 5 – AI CEO Guide

**What the AI CEO CAN do:**
- Calculate a deterministic Business Health Score based on actual database metrics (e.g., missing setup, low stock, out of stock).
- Provide a "Today's Brief" highlighting immediate risks.
- Answer predefined queries like "How is my business?" and "What is low on stock?" using live PostgreSQL data.

**What it CANNOT do yet:**
- Natural language chat processing (LLM integration is planned for a future sprint).
- Voice recognition (Microphone button is a placeholder).
- Automatically execute purchase orders.

**Triggers:**
- Navigating to the Dashboard automatically triggers the Brief generation.
- Clicking the quick-action pills in the AI CEO panel triggers specific data reports.

---

## Part 6 – Database Relationship

**Business**
The root entity. Every record in the system belongs to a Business (Tenant Isolation).
↓
**Warehouse & Category & Supplier**
Foundational entities linked to the Business.
↓
**Product**
Belongs to a Category and a Business. Contains pricing and reorder thresholds, but DOES NOT store stock quantities directly.
↓
**Inventory Movement**
The ledger of stock. Linked to a Product and a Warehouse. Has a `type` (RECEIPT, TRANSFER, ISSUE, DAMAGE) and a `quantity`. 
*Rule: Stock is NEVER stored as a mutable integer; it is ALWAYS dynamically calculated by summing the movements.*
↓
*(Future: Purchase Orders, Finance Ledgers, Audit Logs)*

---

## Part 7 – Judge Demo Script

**Minute 1: Introduction**
"Welcome to AI-BOS. This is not just an ERP; it's an AI-driven Business Operating System. Today, I'll show you how it actively helps run a business."

**Minute 2: Business Setup**
"We start with a clean UI. We've bypassed the login for this demo, dropping us into the Dashboard. Notice the dark, glassmorphic design—it feels modern and fast."

**Minute 3: Inventory Foundation**
"Let's set up our operations. I'll quickly add a Warehouse, a Category, and a Supplier. The architecture ensures strict tenant isolation and data integrity."

**Minute 4: Products & Stock**
"I'll add a new Product, 'Smart Watch', with a reorder level of 20. Then, I'll record a stock receipt of 5 units. Because 5 is less than the reorder level, the system should flag this."

**Minute 5: AI CEO Demonstration**
"Back on the Dashboard, the AI CEO has already analyzed the stock. Look at the 'Today's Brief'—it immediately warns us that a product is running low on stock and drops our Business Health score. This is fully local, deterministic AI querying our database in real-time."

**Minute 6-7: Architecture & Future Proofing**
"We built this using Next.js and PostgreSQL. Notice that stock isn't a static number—it's calculated dynamically from an immutable ledger of movements. This prevents data corruption."

**Minute 8-10: Conclusion & FAQ**
"AI-BOS provides a rock-solid operational foundation that is ready to be scaled with advanced LLMs. Thank you."

---

## Part 8 – FAQ

**Why AI?**
Traditional ERPs require users to pull reports. AI-BOS pushes actionable insights to the user. It acts as an active assistant rather than a passive database.

**Why not SAP?**
SAP is complex, expensive, and outdated in its UX. AI-BOS provides enterprise-grade architecture (immutable ledgers, tenant isolation) with the speed and usability of a modern web app.

**How is inventory calculated?**
Stock is NEVER stored as a mutable state. It is dynamically calculated by aggregating the `InventoryMovement` ledger. This ensures 100% auditability and prevents stock desync.

**How does AI make decisions?**
Currently, it uses a deterministic Rule Engine (`BusinessAnalysisService`) that executes strict business logic against live data. This guarantees zero hallucinations. In the future, this engine will feed verified context into an LLM.

---

## Part 9 – Troubleshooting

- **404 Pages:** If you click a module like "Finance" and see a 404, it means the module is scheduled for a future sprint.
- **No AI Recommendation:** Ensure you have added Products. The AI CEO needs data to analyze. If all stock is perfectly healthy, it will simply report "Healthy".
- **Stock shows 0 after creating a Product:** Products are created with 0 stock by design. You must record a "RECEIPT" via the Adjustments module to add stock.

---

## Part 10 – Project Status

**Completed Modules:**
- Core Architecture (Prisma, Domain Services, Next.js App Router)
- Dashboard UI
- AI CEO (Local Deterministic Version)
- Inventory: Warehouses, Categories, Products, Suppliers, Stock Adjustments (Movements)

**Missing/Future Modules (Roadmap):**
- Purchases & Procurement (Sprint 9)
- Finance (Double-entry ledger)
- Employees (HR)
- Customers (CRM)
- Advanced LLM Integration (OpenAI/Gemini)
