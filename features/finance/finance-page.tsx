"use client";

import * as React from "react";
import { CirclePlus, WalletCards } from "lucide-react";
import { RevenueAreaChart } from "@/components/product/mini-chart";
import { MetricCard } from "@/components/product/metric-card";
import { PageHeader } from "@/components/product/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import { useAtlasStore } from "@/stores/atlas-store";
import { useI18n } from "@/providers/language-provider";
import type { FinanceKind, FinanceRecord } from "@/types/domain";

const revenueData = [
  { month: "Jan", revenue: 12800, profit: 9200 },
  { month: "Feb", revenue: 14200, profit: 10100 },
  { month: "Mar", revenue: 13100, profit: 9400 },
  { month: "Apr", revenue: 17800, profit: 13200 },
  { month: "May", revenue: 21400, profit: 16200 },
  { month: "Jun", revenue: 23800, profit: 18100 },
];

export function FinancePage() {
  const { t } = useI18n();
  const finances = useAtlasStore((state) => state.finances);
  const addFinance = useAtlasStore((state) => state.addFinance);
  const [open, setOpen] = React.useState(false);
  const income = finances.filter((item) => item.kind === "income").reduce((sum, item) => sum + item.amount, 0);
  const expenses = finances.filter((item) => item.kind === "expense").reduce((sum, item) => sum + item.amount, 0);
  const pending = finances.filter((item) => item.status === "pending").reduce((sum, item) => sum + item.amount, 0);

  function submitRecord(formData: FormData) {
    const record: FinanceRecord = {
      id: `fn_${Date.now()}`,
      kind: String(formData.get("kind")) as FinanceKind,
      title: String(formData.get("title")),
      amount: Number(formData.get("amount")),
      category: String(formData.get("category")),
      status: "pending",
      date: String(formData.get("date")),
    };
    addFinance(record);
    setOpen(false);
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4">
      <PageHeader
        eyebrow={t("finance.eyebrow")}
        title={t("finance.title")}
        description={t("finance.description")}
        actions={<Button size="sm" onClick={() => setOpen(true)}><CirclePlus className="size-3.5" />{t("finance.newRecord")}</Button>}
      />
      <section className="grid gap-3 md:grid-cols-4">
        <MetricCard label="May income" value={formatCurrency(income)} delta="+18%" />
        <MetricCard label="Expenses" value={formatCurrency(expenses)} delta="-4%" tone="outline" />
        <MetricCard label="Profit" value={formatCurrency(income - expenses)} delta="+21%" />
        <MetricCard label="Pending" value={formatCurrency(pending)} delta="collect" tone="warning" />
      </section>
      <section className="grid gap-3 xl:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <CardTitle>Revenue analytics</CardTitle>
            <CardDescription>Premium monthly revenue and profit performance.</CardDescription>
          </CardHeader>
          <CardContent><RevenueAreaChart data={revenueData} /></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly goal</CardTitle>
            <CardDescription>Commercial target progress.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid place-items-center rounded-lg border border-border bg-muted/20 p-8">
              <div className="text-center">
                <WalletCards className="mx-auto mb-3 size-7 text-primary" />
                <div className="font-mono text-3xl font-semibold">71%</div>
                <div className="text-xs text-muted-foreground">toward {formatCurrency(30000)}</div>
              </div>
            </div>
            {["Retainer", "Project", "Tools", "Contractors"].map((category) => (
              <div key={category} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{category}</span>
                <Badge variant="outline">{finances.filter((record) => record.category === category).length}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
      <Card>
        <CardHeader><CardTitle>Ledger</CardTitle><CardDescription>Income, expenses, status and categories.</CardDescription></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Record</TableHead><TableHead>Kind</TableHead><TableHead>Category</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
            <TableBody>
              {finances.map((record) => (
                <TableRow key={record.id}>
                  <TableCell><div className="font-medium text-foreground">{record.title}</div><div className="text-muted-foreground">{record.date}</div></TableCell>
                  <TableCell><Badge variant={record.kind === "income" ? "success" : "outline"}>{record.kind}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{record.category}</TableCell>
                  <TableCell><Badge variant={record.status === "pending" ? "warning" : "outline"}>{record.status}</Badge></TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(record.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Financial record</DialogTitle><DialogDescription>Add income or expense with category tracking.</DialogDescription></DialogHeader>
          <form action={submitRecord} className="space-y-3">
            <Input name="title" placeholder="Record title" required />
            <div className="grid gap-3 sm:grid-cols-2">
              <select name="kind" className="h-9 rounded-md border border-input bg-background px-3 text-sm"><option value="income">Income</option><option value="expense">Expense</option></select>
              <Input name="amount" type="number" placeholder="Amount" required />
            </div>
            <div className="grid gap-3 sm:grid-cols-2"><Input name="category" placeholder="Category" required /><Input name="date" placeholder="Date" defaultValue="Today" /></div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">Save record</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
