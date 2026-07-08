# 📘 AI-BOS for Beginners

Welcome to **AI-BOS (AI Business Operating System)**! 

This guide is designed to train you on how to use AI-BOS from day one. We will walk through exactly where to click, why you are clicking it, and what happens behind the scenes.

---

## 1. Navigating the Dashboard
When you log in, you will land on the **Dashboard**.

* **Where to look:** The main screen.
* **What you see:** Your Business Snapshot, Recent Activity, and the **AI CEO Panel**.
* **Why it matters:** This is your command center. Instead of digging through reports, your AI CEO will immediately tell you if something is wrong.
* **Behind the scenes:** Every time you open the Dashboard, the `BusinessAnalysisService` scans your entire database. It calculates your Business Health score based on setup completion and inventory status.

---

## 2. Setting Up Your Foundation (Warehouses & Categories)
Before you can add products, you need a place to store them (Warehouses) and a way to organize them (Categories).

### Step A: Create a Warehouse
1. Click **Inventory** on the left sidebar.
2. Click **Warehouses**.
3. Click the **New Warehouse** button (top right).
4. Fill in the **Name** (e.g., "Main Store") and **Location** (e.g., "New York").
5. Click **Save**.

### Step B: Create a Category
1. Click **Categories** in the Inventory menu.
2. Click **New Category**.
3. Fill in the **Name** (e.g., "Electronics") and **Description**.
4. Click **Save**.

* **Behind the scenes:** AI-BOS assigns these records to your specific "Business ID", ensuring your data is completely isolated and secure.

---

## 3. Adding Your Suppliers
You need to know who supplies your products.

1. Click **Suppliers** on the left sidebar.
2. Click **New Supplier**.
3. Enter the supplier's details (Name, Contact, Email).
4. Click **Save**.

* **Why it matters:** In the future, the AI CEO will automatically draft Purchase Orders to these suppliers when you run low on stock.

---

## 4. Creating Products
Now it's time to tell AI-BOS what you sell.

1. Click **Products** under Inventory.
2. Click **New Product**.
3. Fill in the details:
   - **Name:** e.g., "Wireless Mouse"
   - **SKU:** e.g., "WM-01" (Must be unique!)
   - **Reorder Level:** Set this to a number like `20`. This is the critical threshold. If stock drops below this number, the AI will alert you.
4. Click **Save**.

* **Important:** Creating a product DOES NOT add stock. Your stock is currently `0`.
* **What the AI is doing:** The AI CEO notices you have a product with `0` stock. If you go to the Dashboard right now, it will issue a `CRITICAL` warning!

---

## 5. Adding Stock (Adjustments / Movements)
To fix the `0` stock, we need to officially receive goods.

1. Click **Adjustments** under Inventory.
2. Click **New Adjustment**.
3. Select the **Type:** Choose `RECEIPT` (You are receiving new stock).
4. Select your **Product** and **Warehouse**.
5. Enter the **Quantity**: e.g., `100`.
6. Click **Save**.

* **Behind the scenes:** AI-BOS NEVER just changes a number in a database. It creates an immutable (unchangeable) `InventoryMovement` record. Your total stock is calculated by adding up all these movements. This prevents data corruption and makes audits incredibly easy.

---

## 6. Consulting the AI CEO
Now that you have products and stock, let's see the AI in action.

1. Click **Dashboard** on the top left.
2. Look at the **AI CEO Panel** on the right side.
3. Click one of the quick questions, like **"What products are low on stock?"**
4. The AI CEO will respond instantly!

* **What happens:** If your stock of Wireless Mice is `100` and your reorder level is `20`, the AI will say your inventory is healthy.
* **Try this:** Go back to Adjustments and create a `DAMAGE` adjustment for `90` mice. Your stock is now `10`. Go back to the Dashboard. The AI CEO will immediately flag a `MEDIUM` or `HIGH` warning telling you that you are running low on stock!

---

## Conclusion
You have successfully set up AI-BOS, created your inventory foundation, recorded secure stock movements, and utilized the deterministic AI CEO to monitor your business health!
