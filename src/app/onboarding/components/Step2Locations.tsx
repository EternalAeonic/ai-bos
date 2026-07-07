"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { Plus, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Step2Locations() {
  const { data, updateData } = useOnboarding();

  const addLocation = () => {
    updateData({
      locations: [
        ...data.locations,
        { name: "", type: "OFFICE", address: "", city: "", state: "", country: "", postalCode: "" }
      ]
    });
  };

  const removeLocation = (index: number) => {
    updateData({
      locations: data.locations.filter((_, i) => i !== index)
    });
  };

  const updateLocation = (index: number, field: string, value: string) => {
    const newLocations = [...data.locations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    updateData({ locations: newLocations });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-semibold text-white tracking-tight mb-2">Locations</h2>
          <p className="text-white/60">Where does your business operate from?</p>
        </div>
        <Button 
          onClick={addLocation}
          className="bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] rounded-lg gap-2"
        >
          <Plus className="w-4 h-4" /> Add Location
        </Button>
      </div>

      {data.locations.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-12 text-center">
          <MapPin className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">No locations added yet</h3>
          <p className="text-white/60 mb-6">Add your headquarters, warehouses, or branch offices.</p>
          <Button 
            onClick={addLocation}
            className="bg-[#00D9C0] hover:bg-[#00D9C0]/90 text-[#0B0F1A]"
          >
            Add Your First Location
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.locations.map((loc, index) => (
            <div key={index} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 relative group">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeLocation(index)}
                className="absolute top-4 right-4 text-white/40 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Location Name</label>
                  <input
                    type="text"
                    value={loc.name}
                    onChange={(e) => updateLocation(index, "name", e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 outline-none"
                    placeholder="e.g. Main HQ"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Type</label>
                  <select
                    value={loc.type}
                    onChange={(e) => updateLocation(index, "type", e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 outline-none [&>option]:bg-[#0B0F1A]"
                  >
                    <option value="OFFICE">Office</option>
                    <option value="WAREHOUSE">Warehouse</option>
                    <option value="STORE">Retail Store</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-white/80">Address</label>
                  <input
                    type="text"
                    value={loc.address}
                    onChange={(e) => updateLocation(index, "address", e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 outline-none"
                    placeholder="123 Business Rd"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">City</label>
                  <input
                    type="text"
                    value={loc.city}
                    onChange={(e) => updateLocation(index, "city", e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Country</label>
                  <input
                    type="text"
                    value={loc.country}
                    onChange={(e) => updateLocation(index, "country", e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
