"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function ChartOfAccounts() {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const [accRes, balRes] = await Promise.all([
          fetch("/api/finance/accounts"),
          fetch("/api/finance/reports?type=trial-balance")
        ]);
        
        if (accRes.ok && balRes.ok) {
          const accs = await accRes.json();
          const bals = await balRes.json();
          
          const balMap = new Map(bals.map((b: any) => [b.accountId, b]));
          
          setAccounts(accs.map((a: any) => ({
            ...a,
            balance: balMap.get(a.id)?.balance || 0,
            balanceType: balMap.get(a.id)?.balanceType || (['ASSET', 'EXPENSE'].includes(a.type) ? 'DEBIT' : 'CREDIT')
          })));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAccounts();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chart of Accounts</CardTitle>
        <CardDescription>A complete list of your business accounts and their current balances.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((acc) => (
                  <TableRow key={acc.id}>
                    <TableCell className="font-mono font-medium">{acc.code}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {acc.name}
                        {acc.isSystemAccount && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">System</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{acc.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${acc.balance.toFixed(2)}
                      <span className="text-[10px] text-muted-foreground ml-1">{acc.balanceType === 'DEBIT' ? 'Dr' : 'Cr'}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
