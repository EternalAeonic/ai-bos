"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, UserPlus, Upload, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Step5Employees() {
  const { data, updateData } = useOnboarding();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [newEmp, setNewEmp] = useState({ name: "", email: "", department: "", role: "Employee" });

  const addEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    updateData({
      employees: [...data.employees, { ...newEmp, id: Date.now(), status: "Pending" }]
    });
    setNewEmp({ name: "", email: "", department: "", role: "Employee" });
    setIsPanelOpen(false);
  };

  return (
    <div className="space-y-10 relative">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Bring your team on board</h2>
          <p className="text-[#8A8F98]">Invite employees so AI-BOS can map reporting lines and permissions.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-10 border-[#EAEAEA] text-[#141B41] hover:bg-[#F7F8F9]">
            <Upload className="w-4 h-4 mr-2" /> Import CSV
          </Button>
          <Button onClick={() => setIsPanelOpen(true)} className="h-10 bg-[#141B41] hover:bg-[#00D9C0] text-white">
            <UserPlus className="w-4 h-4 mr-2" /> Invite Employee
          </Button>
        </div>
      </div>

      {data.employees.length === 0 ? (
        <div className="border border-dashed border-[#EAEAEA] rounded-3xl h-64 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[#F7F8F9] rounded-2xl flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-[#8A8F98]" />
          </div>
          <h3 className="text-lg font-semibold text-[#141B41] mb-1">No employees added yet</h3>
          <p className="text-sm text-[#8A8F98]">Start building your organization by inviting team members.</p>
        </div>
      ) : (
        <div className="border border-[#EAEAEA] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <Table>
            <TableHeader className="bg-[#F7F8F9]">
              <TableRow className="border-b-[#EAEAEA] hover:bg-[#F7F8F9]">
                <TableHead className="font-medium text-[#8A8F98] h-10">Name</TableHead>
                <TableHead className="font-medium text-[#8A8F98] h-10">Department</TableHead>
                <TableHead className="font-medium text-[#8A8F98] h-10">Role</TableHead>
                <TableHead className="font-medium text-[#8A8F98] h-10 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.employees.map((emp) => (
                <TableRow key={emp.id} className="border-b-[#EAEAEA] hover:bg-[#F7F8F9]/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#141B41] to-[#00D9C0] text-white flex items-center justify-center text-xs font-bold">
                        {emp.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-[#141B41]">{emp.name}</span>
                        <span className="text-[10px] text-[#8A8F98]">{emp.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#8A8F98] text-sm">{emp.department}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-[#F7F8F9] text-[#141B41] text-[10px] font-semibold rounded-md border border-[#EAEAEA]">
                      {emp.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-amber-500 text-xs font-medium bg-amber-500/10 px-2 py-1 rounded-full">
                      {emp.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Slide-over Panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsPanelOpen(false)}
              className="fixed inset-0 bg-[#141B41]/20 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-96 bg-white shadow-2xl z-[101] border-l border-[#EAEAEA] flex flex-col"
            >
              <div className="h-16 border-b border-[#EAEAEA] flex items-center justify-between px-6 shrink-0">
                <h3 className="font-semibold text-lg">Invite Employee</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsPanelOpen(false)} className="text-[#8A8F98]">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto">
                <form id="invite-form" onSubmit={addEmployee} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input required value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} className="bg-[#F7F8F9]" />
                  </div>
                  <div className="space-y-2">
                    <Label>Work Email</Label>
                    <Input type="email" required value={newEmp.email} onChange={e => setNewEmp({...newEmp, email: e.target.value})} className="bg-[#F7F8F9]" />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <select required value={newEmp.department} onChange={e => setNewEmp({...newEmp, department: e.target.value})} className="w-full h-10 px-3 rounded-md border border-[#EAEAEA] bg-[#F7F8F9] text-sm">
                      <option value="">Select...</option>
                      {data.departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <select required value={newEmp.role} onChange={e => setNewEmp({...newEmp, role: e.target.value})} className="w-full h-10 px-3 rounded-md border border-[#EAEAEA] bg-[#F7F8F9] text-sm">
                      <option value="Employee">Employee</option>
                      <option value="Manager">Manager</option>
                      <option value="Finance Manager">Finance Manager</option>
                      <option value="Inventory Manager">Inventory Manager</option>
                    </select>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-[#EAEAEA] shrink-0 bg-[#F7F8F9]">
                <Button form="invite-form" type="submit" className="w-full bg-[#141B41] hover:bg-[#00D9C0]">
                  Send Invitation
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
