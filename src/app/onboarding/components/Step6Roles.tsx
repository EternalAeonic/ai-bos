"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const roles = [
  { id: "owner", name: "Owner", desc: "Full access to everything" },
  { id: "ceo", name: "CEO", desc: "Strategic oversight" },
  { id: "finance", name: "Finance Manager", desc: "Manages books and payments" },
  { id: "inventory", name: "Inventory Manager", desc: "Manages stock and warehouses" },
  { id: "employee", name: "Employee", desc: "Basic access" },
];

export function Step6Roles() {
  const { data, updateData } = useOnboarding();

  // Initialize permissions if empty
  const permissions = data.roles.length > 0 ? data.roles : roles.map(r => ({
    roleId: r.id,
    view: true,
    edit: r.id !== "employee",
    approve: r.id === "owner" || r.id === "ceo",
    delete: r.id === "owner",
    export: r.id !== "employee",
    aiApproval: r.id === "owner" || r.id === "finance",
  }));

  const togglePerm = (roleId: string, perm: string) => {
    const newPerms = permissions.map((p: any) => 
      p.roleId === roleId ? { ...p, [perm]: !p[perm] } : p
    );
    updateData({ roles: newPerms });
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Who can do what?</h2>
        <p className="text-[#8A8F98]">Set default permissions for standard roles across your business.</p>
      </div>

      <div className="border border-[#EAEAEA] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <Table>
          <TableHeader className="bg-[#F7F8F9]">
            <TableRow className="border-b-[#EAEAEA] hover:bg-[#F7F8F9]">
              <TableHead className="font-medium text-[#8A8F98] h-12 w-1/3">Role</TableHead>
              <TableHead className="font-medium text-[#8A8F98] h-12 text-center">View</TableHead>
              <TableHead className="font-medium text-[#8A8F98] h-12 text-center">Edit</TableHead>
              <TableHead className="font-medium text-[#8A8F98] h-12 text-center">Approve</TableHead>
              <TableHead className="font-medium text-[#8A8F98] h-12 text-center">Delete</TableHead>
              <TableHead className="font-medium text-[#00D9C0] h-12 text-center bg-[#00D9C0]/5">
                <div className="flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Approval
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => {
              const perm = permissions.find((p: any) => p.roleId === role.id) || permissions[0];
              
              return (
                <TableRow key={role.id} className="border-b-[#EAEAEA] hover:bg-[#F7F8F9]/50 h-16">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-[#141B41]">{role.name}</span>
                      <span className="text-[10px] text-[#8A8F98]">{role.desc}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch checked={perm.view} onCheckedChange={() => togglePerm(role.id, "view")} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch checked={perm.edit} onCheckedChange={() => togglePerm(role.id, "edit")} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch checked={perm.approve} onCheckedChange={() => togglePerm(role.id, "approve")} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch checked={perm.delete} onCheckedChange={() => togglePerm(role.id, "delete")} />
                  </TableCell>
                  <TableCell className="text-center bg-[#00D9C0]/5">
                    <Switch 
                      checked={perm.aiApproval} 
                      onCheckedChange={() => togglePerm(role.id, "aiApproval")}
                      className="data-[state=checked]:bg-[#00D9C0]"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
