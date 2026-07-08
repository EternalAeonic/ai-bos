# AI-BOS Demo Script

## Goal
A structured script for presenting AI-BOS to judges.

---

### Minute 1: Introduction
"Hello, and welcome to AI-BOS, the AI Business Operating System. 
Traditional ERPs are passive databases—you have to dig for reports to know what’s going wrong. 
AI-BOS is different. It is an active participant in your business. It monitors operations, calculates risks in real-time, and surfaces insights deterministically before problems occur."

---

### Minute 2: Business Setup & Architecture
"Notice the clean, modern interface. It’s designed to be instantly usable. 
Under the hood, it’s built on Next.js and PostgreSQL using a strict Domain-Driven Design. 
Everything is tenant-isolated, meaning business data never leaks. We’ve bypassed the login for this demo, dropping us right into the active Dashboard."

---

### Minute 3: Core Inventory
"Let’s build the foundation of a business. 
[Navigate to Inventory -> Warehouses] 
I’ll create a 'Main Distribution Hub'. 
[Navigate to Inventory -> Products] 
Next, I’ll add a product: 'Wireless Mouse'. I will set the reorder level to 20 units. This tells our system exactly when we need to restock."

---

### Minute 4: Immutable Ledgers
"Now I need to add stock. 
[Navigate to Inventory -> Adjustments] 
I'll record a 'RECEIPT' of 100 units. 
A critical feature of AI-BOS is that stock is NEVER stored as a mutable number. It’s dynamically calculated from an immutable ledger of movements. This makes our data 100% auditable and prevents the sync errors common in legacy ERPs."

---

### Minute 5: AI CEO Demonstration
"Let’s see the AI in action. 
[Navigate back to Dashboard] 
The AI CEO panel instantly tells us our business is healthy. 
But what happens if disaster strikes? 
[Navigate to Adjustments -> Create a DAMAGE movement for 90 units] 
Our stock drops to 10—below the reorder level of 20."

---

### Minute 6: AI Insight
"[Navigate to Dashboard] 
Instantly, the AI CEO has caught the issue. Our 'Today's Brief' shows a MEDIUM risk warning that a product is running low on stock. It generated this insight deterministically from our local database, meaning zero hallucinations and zero latency."

---

### Minute 7: The Future (Purchases & Finance)
"In future modules like Purchases and Finance, this insight won’t just be a warning. The AI will automatically draft a Purchase Request for those missing 90 units, route it for approval, and automatically reconcile the accounting journal entries once the goods are received."

---

### Minute 8: Benefits
"This architecture gives small and medium businesses enterprise-grade auditing, a stunning user experience, and an AI that actively prevents stockouts—all without the massive overhead of traditional systems."

---

### Minute 9-10: Conclusion & Q&A
"AI-BOS is ready to revolutionize operations. Thank you for your time. I’d be happy to take any questions."

---

## FAQ for Judges

**Q: Why AI? Why not just standard reports?**
A: Standard reports require the user to proactively look for problems. The AI CEO actively monitors the data and surfaces problems automatically, acting as a tireless assistant.

**Q: How does the AI make decisions? Is there a risk of hallucinations?**
A: Currently, the AI CEO uses a deterministic Rule Engine (`BusinessAnalysisService`) querying PostgreSQL. This guarantees 100% accuracy. We intentionally built the deterministic foundation first before adding an LLM wrapper.

**Q: How is data secured?**
A: Every query is filtered by a `businessId` (Tenant Isolation), and the Next.js App Router enforces strict server-side verification before executing any action.
