"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Upload, Plus, Database, FileSpreadsheet } from "lucide-react";
import { useState } from "react";

export function Step7Inventory() {
  const { data, updateData } = useOnboarding();
  const [items, setItems] = useState<any[]>(data.inventory.length > 0 ? data.inventory : [
    { id: 1, name: "", sku: "", category: "", warehouse: "", currentStock: "", purchasePrice: "", sellingPrice: "" }
  ]);

  const updateItem = (id: number, field: string, value: string) => {
    const newItems = items.map(item => item.id === id ? { ...item, [field]: value } : item);
    setItems(newItems);
    updateData({ inventory: newItems.filter(i => i.name.trim() !== "") });
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", sku: "", category: "", warehouse: "", currentStock: "", purchasePrice: "", sellingPrice: "" }]);
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Stock your shelves</h2>
        <p className="text-[#8A8F98]">Import your product catalog. AI-BOS will automatically predict restock dates.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <button className="border border-[#00D9C0] bg-[#00D9C0]/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-[#00D9C0]/10 transition-colors h-48 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-20">
            <Package className="w-24 h-24 text-[#00D9C0] -translate-y-1/4 translate-x-1/4" />
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-[#EAEAEA] relative z-10">
            <Plus className="w-5 h-5 text-[#141B41]" />
          </div>
          <h3 className="font-semibold text-[#141B41] relative z-10">Manual Entry</h3>
          <p className="text-xs text-[#8A8F98] mt-1 relative z-10">Add products one by one</p>
        </button>
        
        <button className="border border-[#EAEAEA] bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-[#141B41] transition-colors h-48 shadow-sm">
          <div className="w-12 h-12 bg-[#F7F8F9] rounded-full flex items-center justify-center mb-4 border border-[#EAEAEA]">
            <FileSpreadsheet className="w-5 h-5 text-[#141B41]" />
          </div>
          <h3 className="font-semibold text-[#141B41]">Upload CSV</h3>
          <p className="text-xs text-[#8A8F98] mt-1">Bulk import via spreadsheet</p>
        </button>

        <button className="border border-[#EAEAEA] bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-[#141B41] transition-colors h-48 shadow-sm">
          <div className="w-12 h-12 bg-[#F7F8F9] rounded-full flex items-center justify-center mb-4 border border-[#EAEAEA]">
            <Database className="w-5 h-5 text-[#141B41]" />
          </div>
          <h3 className="font-semibold text-[#141B41]">Connect ERP</h3>
          <p className="text-xs text-[#8A8F98] mt-1">Sync with QuickBooks, SAP, etc.</p>
        </button>
      </div>

      <div className="border border-[#EAEAEA] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <Table>
          <TableHeader className="bg-[#F7F8F9]">
            <TableRow className="border-b-[#EAEAEA] hover:bg-[#F7F8F9]">
              <TableHead className="font-medium text-[#8A8F98] h-10 w-[200px]">Product Name</TableHead>
              <TableHead className="font-medium text-[#8A8F98] h-10 w-[120px]">SKU</TableHead>
              <TableHead className="font-medium text-[#8A8F98] h-10 w-[120px]">Category</TableHead>
              <TableHead className="font-medium text-[#8A8F98] h-10 w-[100px] text-right">Stock</TableHead>
              <TableHead className="font-medium text-[#8A8F98] h-10 w-[100px] text-right">Cost</TableHead>
              <TableHead className="font-medium text-[#8A8F98] h-10 w-[100px] text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id} className="border-b-[#EAEAEA] hover:bg-[#F7F8F9]/50">
                <TableCell className="p-2">
                  <Input 
                    value={item.name} 
                    onChange={e => updateItem(item.id, "name", e.target.value)}
                    placeholder="e.g. MacBook Pro" 
                    className="bg-transparent border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] h-8 text-sm px-2"
                  />
                </TableCell>
                <TableCell className="p-2">
                  <Input 
                    value={item.sku} 
                    onChange={e => updateItem(item.id, "sku", e.target.value)}
                    placeholder="MBP-14" 
                    className="bg-transparent border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] h-8 text-sm px-2"
                  />
                </TableCell>
                <TableCell className="p-2">
                  <Input 
                    value={item.category} 
                    onChange={e => updateItem(item.id, "category", e.target.value)}
                    placeholder="Electronics" 
                    className="bg-transparent border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] h-8 text-sm px-2"
                  />
                </TableCell>
                <TableCell className="p-2">
                  <Input 
                    value={item.currentStock} 
                    onChange={e => updateItem(item.id, "currentStock", e.target.value)}
                    placeholder="0" type="number"
                    className="bg-transparent border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] h-8 text-sm px-2 text-right"
                  />
                </TableCell>
                <TableCell className="p-2">
                  <Input 
                    value={item.purchasePrice} 
                    onChange={e => updateItem(item.id, "purchasePrice", e.target.value)}
                    placeholder="0.00" type="number"
                    className="bg-transparent border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] h-8 text-sm px-2 text-right"
                  />
                </TableCell>
                <TableCell className="p-2">
                  <Input 
                    value={item.sellingPrice} 
                    onChange={e => updateItem(item.id, "sellingPrice", e.target.value)}
                    placeholder="0.00" type="number"
                    className="bg-transparent border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] h-8 text-sm px-2 text-right"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-2 bg-[#F7F8F9] border-t border-[#EAEAEA]">
          <Button variant="ghost" size="sm" onClick={addItem} className="text-[#8A8F98] hover:text-[#141B41] h-8">
            <Plus className="w-4 h-4 mr-1" /> Add Row
          </Button>
        </div>
      </div>
    </div>
  );
}
