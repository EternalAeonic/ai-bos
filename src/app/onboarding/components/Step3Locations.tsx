"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Building2, Store, Factory, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const typeIcons: Record<string, any> = {
  Office: Building2,
  Warehouse: Store, // Store icon looks boxy
  Retail: Store,
  Factory: Factory,
};

export function Step3Locations() {
  const { data, updateData } = useOnboarding();

  const addLocation = () => {
    updateData({
      locations: [...data.locations, { id: Date.now(), name: "", type: "Office", address: "", city: "" }]
    });
  };

  const updateLocation = (id: number, field: string, value: string) => {
    updateData({
      locations: data.locations.map(loc => loc.id === id ? { ...loc, [field]: value } : loc)
    });
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Where do you operate?</h2>
        <p className="text-[#8A8F98]">Add your warehouses, offices, and retail stores to manage multi-location inventory.</p>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {data.locations.map((loc, index) => {
            const Icon = typeIcons[loc.type] || Building2;
            
            return (
              <motion.div 
                key={loc.id}
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden"
              >
                {/* Decorative map background blur */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D9C0]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <div className="flex gap-6 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[#F7F8F9] flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-[#141B41]" />
                  </div>
                  
                  <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-[#8A8F98]">Location Name</Label>
                      <Input 
                        value={loc.name}
                        onChange={(e) => updateLocation(loc.id, "name", e.target.value)}
                        placeholder={`Location ${index + 1}`}
                        className="bg-transparent border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] h-9 px-2 -ml-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-[#8A8F98]">Type</Label>
                      <select
                        value={loc.type}
                        onChange={(e) => updateLocation(loc.id, "type", e.target.value)}
                        className="w-full bg-transparent border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] rounded-md px-2 h-9 -ml-2 text-sm outline-none"
                      >
                        <option value="Office">Office</option>
                        <option value="Warehouse">Warehouse</option>
                        <option value="Retail">Retail Store</option>
                        <option value="Factory">Factory</option>
                      </select>
                    </div>
                    
                    <div className="col-span-2 space-y-1">
                      <Label className="text-xs text-[#8A8F98]">Address</Label>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#8A8F98] shrink-0" />
                        <Input 
                          value={loc.address}
                          onChange={(e) => updateLocation(loc.id, "address", e.target.value)}
                          placeholder="Street Address, City, Zip Code"
                          className="bg-transparent border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] h-9 px-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <Button 
          variant="outline" 
          onClick={addLocation}
          className="w-full h-14 border-dashed border-[#EAEAEA] text-[#8A8F98] hover:border-[#00D9C0] hover:text-[#00D9C0] hover:bg-[#00D9C0]/5 transition-colors rounded-2xl"
        >
          <Plus className="w-4 h-4 mr-2" /> Add another location
        </Button>
      </div>
    </div>
  );
}
