import SupplierForm from "./supplier-form";

const DEMO_BUSINESS_ID = "demo-business-123";

export default function NewSupplierPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Add New Supplier</h2>
      </div>
      
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <SupplierForm businessId={DEMO_BUSINESS_ID} />
      </div>
    </div>
  );
}
