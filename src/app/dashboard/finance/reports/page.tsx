"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch("/api/finance/reports?type=trial-balance");
        if (res.ok) {
          setData(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  if (loading || !data) {
    return <Skeleton className="h-96 w-full" />;
  }

  const totalDebit = data.reduce((sum: number, acc: any) => sum + (acc.balanceType === 'DEBIT' ? acc.balance : 0), 0);
  const totalCredit = data.reduce((sum: number, acc: any) => sum + (acc.balanceType === 'CREDIT' ? acc.balance : 0), 0);
  
  // A small tolerance for trial balance
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Trial Balance</CardTitle>
              <CardDescription>Verify that total debits equal total credits.</CardDescription>
            </div>
            {isBalanced ? (
              <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-sm font-medium">Balanced</div>
            ) : (
              <div className="bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm font-medium">Unbalanced</div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((acc: any) => (
                  <TableRow key={acc.accountId}>
                    <TableCell className="font-medium">
                      {acc.code} - {acc.name}
                    </TableCell>
                    <TableCell className="text-right">
                      {acc.balanceType === 'DEBIT' && acc.balance > 0 ? `$${acc.balance.toFixed(2)}` : ""}
                    </TableCell>
                    <TableCell className="text-right">
                      {acc.balanceType === 'CREDIT' && acc.balance > 0 ? `$${acc.balance.toFixed(2)}` : ""}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell className="text-right">Total:</TableCell>
                  <TableCell className="text-right">${totalDebit.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${totalCredit.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
