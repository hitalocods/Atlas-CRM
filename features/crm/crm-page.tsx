"use client";

import * as React from "react";
import { CirclePlus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ActivityTimeline } from "@/components/product/activity-timeline";
import { MetricCard } from "@/components/product/metric-card";
import { PageHeader } from "@/components/product/page-header";
import { SearchFilter } from "@/components/product/search-filter";
import { ClientStatusBadge } from "@/components/product/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import { useI18n } from "@/providers/language-provider";
import { useAtlasStore } from "@/stores/atlas-store";
import type { Client, Status } from "@/types/domain";

const blankClient: Client = {
  id: "",
  name: "",
  company: "",
  email: "",
  status: "lead",
  tags: [],
  revenue: 0,
  lastContact: "Today",
  notes: "",
};

export function CrmPage() {
  const { t } = useI18n();
  const clients = useAtlasStore((state) => state.clients);
  const activities = useAtlasStore((state) => state.activities);
  const addClient = useAtlasStore((state) => state.addClient);
  const updateClient = useAtlasStore((state) => state.updateClient);
  const removeClient = useAtlasStore((state) => state.removeClient);
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<Status | "all">("all");
  const [editing, setEditing] = React.useState<Client | null>(null);

  const filtered = clients.filter((client) => {
    const search = `${client.name} ${client.company} ${client.email} ${client.tags.join(" ")}`.toLowerCase();
    return search.includes(query.toLowerCase()) && (status === "all" || client.status === status);
  });

  const totalRevenue = clients.reduce((sum, client) => sum + client.revenue, 0);
  const activeClients = clients.filter((client) => client.status === "active").length;

  function submitClient(formData: FormData) {
    const client: Client = {
      id: editing?.id || `cl_${Date.now()}`,
      name: String(formData.get("name")),
      company: String(formData.get("company")),
      email: String(formData.get("email")),
      status: String(formData.get("status")) as Status,
      tags: String(formData.get("tags")).split(",").map((tag) => tag.trim()).filter(Boolean),
      revenue: Number(formData.get("revenue")),
      lastContact: String(formData.get("lastContact")),
      notes: String(formData.get("notes")),
    };

    if (editing?.id) updateClient(client);
    else addClient(client);
    setEditing(null);
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4">
      <PageHeader
        eyebrow={t("crm.eyebrow")}
        title={t("crm.title")}
        description={t("crm.description")}
        actions={
          <Button size="sm" onClick={() => setEditing(blankClient)}>
            <CirclePlus className="size-3.5" />
            {t("crm.newClient")}
          </Button>
        }
      />

      <section className="grid gap-3 md:grid-cols-3">
        <MetricCard label={t("crm.pipelineRevenue")} value={formatCurrency(totalRevenue)} delta="+12.4%" />
        <MetricCard label={t("dashboard.activeClients")} value={String(activeClients)} delta="+2" />
        <MetricCard label={t("crm.contactCadence")} value="94%" delta="healthy" tone="outline" />
      </section>

      <section className="grid gap-3 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>{t("crm.clients")}</CardTitle>
            <CardDescription>Search and filter client records in real time.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col gap-2 md:flex-row">
              <SearchFilter value={query} onChange={setQuery} placeholder="Search clients, tags, companies..." />
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as Status | "all")}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm"
              >
                <option value="all">All statuses</option>
                <option value="lead">Lead</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Last contact</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">{client.company}</div>
                      <div className="text-muted-foreground">{client.name} · {client.email}</div>
                    </TableCell>
                    <TableCell><ClientStatusBadge status={client.status} /></TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {client.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{formatCurrency(client.revenue)}</TableCell>
                    <TableCell className="text-muted-foreground">{client.lastContact}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="size-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditing(client)}><Pencil className="size-3.5" />Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => removeClient(client.id)}><Trash2 className="size-3.5" />Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-3">
          <Card>
            <CardHeader>
              <CardTitle>Contact notes</CardTitle>
              <CardDescription>High-signal relationship context.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {filtered.slice(0, 3).map((client) => (
                <div key={client.id} className="rounded-lg border border-border bg-muted/20 p-3">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <div className="text-xs font-medium">{client.company}</div>
                    <ClientStatusBadge status={client.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">{client.notes}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <ActivityTimeline activities={activities.slice(0, 5)} title="CRM activity" />
        </div>
      </section>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit client" : "New client"}</DialogTitle>
            <DialogDescription>Capture the client profile, tags, revenue and relationship notes.</DialogDescription>
          </DialogHeader>
          {editing ? (
            <form action={submitClient} className="space-y-3">
              <Input name="company" defaultValue={editing.company} placeholder="Company" required />
              <Input name="name" defaultValue={editing.name} placeholder="Contact name" required />
              <Input name="email" defaultValue={editing.email} placeholder="Email" type="email" required />
              <div className="grid gap-3 sm:grid-cols-2">
                <select name="status" defaultValue={editing.status} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="lead">Lead</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="archived">Archived</option>
                </select>
                <Input name="revenue" defaultValue={editing.revenue} placeholder="Revenue" type="number" />
              </div>
              <Input name="tags" defaultValue={editing.tags.join(", ")} placeholder="Tags comma separated" />
              <Input name="lastContact" defaultValue={editing.lastContact} placeholder="Last contact" />
              <textarea
                name="notes"
                defaultValue={editing.notes}
                placeholder="Notes"
                className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit">Save client</Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
