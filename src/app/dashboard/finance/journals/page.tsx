"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function JournalEntries() {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await fetch("/api/finance/journal-entries");
        if (res.ok) {
          setEntries(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchEntries();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal Entries</CardTitle>
        <CardDescription>View all posted ledger transactions in chronological order.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : entries.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">No journal entries found.</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-40">Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <>
                    <TableRow key={entry.id} className="bg-muted/30">
                      <TableCell colSpan={5} className="py-2 text-xs text-muted-foreground">
                        <span className="font-semibold">{new Date(entry.entryDate).toLocaleString()}</span>
                        <span className="mx-2">|</span>
                        {entry.description}
                        {entry.sourceType && (
                          <Badge variant="outline" className="ml-2 text-[10px]">{entry.sourceType}</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                    {entry.lines.map((line: any) => (
                      <TableRow key={line.id} className="border-b-0 hover:bg-transparent">
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className="font-medium text-sm">
                          {line.account?.name} <span className="text-muted-foreground text-xs">({line.account?.code})</span>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {line.debit > 0 ? `$${Number(line.debit).toFixed(2)}` : ""}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {line.credit > 0 ? `$${Number(line.credit).toFixed(2)}` : ""}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="h-4 border-b"><TableCell colSpan={5}></TableCell></TableRow>
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
