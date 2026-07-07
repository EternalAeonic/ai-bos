-- Enable Row-Level Security on all business-scoped tables
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Supplier" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Warehouse" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InventoryMovement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
-- Sprint 1 Tables (assuming Business scoping applies)
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
-- Sprint 3 Tables
ALTER TABLE "LedgerAccount" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "JournalEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "JournalLine" ENABLE ROW LEVEL SECURITY;

-- Create policies enforcing business isolation based on app.current_business transaction variable
-- Ensure to cast current_setting to text

DO $$
BEGIN
    -- Product Policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'business_isolation_product' AND tablename = 'Product') THEN
        CREATE POLICY business_isolation_product ON "Product"
        FOR ALL USING ("businessId" = current_setting('app.current_business', true)::text);
    END IF;

    -- Category Policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'business_isolation_category' AND tablename = 'Category') THEN
        CREATE POLICY business_isolation_category ON "Category"
        FOR ALL USING ("businessId" = current_setting('app.current_business', true)::text);
    END IF;

    -- Supplier Policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'business_isolation_supplier' AND tablename = 'Supplier') THEN
        CREATE POLICY business_isolation_supplier ON "Supplier"
        FOR ALL USING ("businessId" = current_setting('app.current_business', true)::text);
    END IF;

    -- Warehouse Policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'business_isolation_warehouse' AND tablename = 'Warehouse') THEN
        CREATE POLICY business_isolation_warehouse ON "Warehouse"
        FOR ALL USING ("businessId" = current_setting('app.current_business', true)::text);
    END IF;

    -- InventoryMovement Policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'business_isolation_inventorymovement' AND tablename = 'InventoryMovement') THEN
        CREATE POLICY business_isolation_inventorymovement ON "InventoryMovement"
        FOR ALL USING ("businessId" = current_setting('app.current_business', true)::text);
    END IF;

    -- AuditLog Policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'business_isolation_auditlog' AND tablename = 'AuditLog') THEN
        CREATE POLICY business_isolation_auditlog ON "AuditLog"
        FOR ALL USING ("businessId" = current_setting('app.current_business', true)::text);
    END IF;
    
    -- User Policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'business_isolation_user' AND tablename = 'User') THEN
        CREATE POLICY business_isolation_user ON "User"
        FOR ALL USING ("businessId" = current_setting('app.current_business', true)::text);
    END IF;

    -- LedgerAccount Policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'business_isolation_ledgeraccount' AND tablename = 'LedgerAccount') THEN
        CREATE POLICY business_isolation_ledgeraccount ON "LedgerAccount"
        FOR ALL USING ("businessId" = current_setting('app.current_business', true)::text);
    END IF;

    -- JournalEntry Policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'business_isolation_journalentry' AND tablename = 'JournalEntry') THEN
        CREATE POLICY business_isolation_journalentry ON "JournalEntry"
        FOR ALL USING ("businessId" = current_setting('app.current_business', true)::text);
    END IF;

    -- JournalLine Policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'business_isolation_journalline' AND tablename = 'JournalLine') THEN
        CREATE POLICY business_isolation_journalline ON "JournalLine"
        FOR ALL USING ("businessId" = current_setting('app.current_business', true)::text);
    END IF;
END $$;
