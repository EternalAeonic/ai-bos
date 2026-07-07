import { prisma } from "@/lib/prisma";
import { Building2, Plus, Edit } from "lucide-react";
import Link from "next/link";

const DEMO_BUSINESS_ID = "demo-business-123";

export default async function SuppliersPage() {
  const suppliers = await prisma.supplier.findMany({
    where: { businessId: DEMO_BUSINESS_ID, deletedAt: null },
    orderBy: { name: "asc" }
  });

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
          <p className="text-muted-foreground mt-1">Manage your vendors and suppliers.</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-[#00D9C0] hover:bg-[#00c2ab] text-[#0B0F1A] text-sm font-bold rounded-xl transition-all shadow-[0_8px_24px_rgba(0,217,192,0.25)] hover:shadow-[0_8px_32px_rgba(0,217,192,0.4)]"
        >
          <Plus className="w-4 h-4" />
          Add Supplier
        </button>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden mt-6">
        {suppliers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
             <div className="w-16 h-16 rounded-full bg-white/[0.05] flex items-center justify-center mb-4">
               <Building2 className="w-8 h-8 text-white/40" />
             </div>
             <h3 className="text-lg font-bold text-white mb-2">No Suppliers Yet</h3>
             <p className="text-sm text-white/50 max-w-sm mb-6">Add your suppliers to link them to products and generate purchase orders.</p>
             <button className="flex items-center gap-2 px-6 py-3 bg-white/[0.05] hover:bg-white/[0.1] text-white text-sm font-bold rounded-xl transition-all border border-white/[0.1]">
                <Plus className="w-4 h-4" />
                Add Supplier
             </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-white/50 uppercase bg-white/[0.02] border-b border-white/[0.06]">
                <tr>
                  <th className="px-6 py-4 font-medium">Supplier Name</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Lead Time</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5 text-white/40" />
                        </div>
                        <span className="font-bold text-white">{supplier.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white/70">{supplier.email || "No email"}</span>
                        <span className="text-[10px] text-white/40">{supplier.phone || "No phone"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {supplier.leadTimeDays ? (
                        <span className="text-white/70">{supplier.leadTimeDays} days</span>
                      ) : (
                        <span className="text-white/30">Unknown</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {supplier.isPreferred ? (
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#00D9C0]/10 text-[#00D9C0]">Preferred</span>
                      ) : (
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-white/10 text-white/50">Standard</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
