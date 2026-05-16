"use client";

import * as React from "react";
import { CirclePlus, Copy, EyeOff, KeyRound, LinkIcon, LockKeyhole, StickyNote } from "lucide-react";
import { MetricCard } from "@/components/product/metric-card";
import { PageHeader } from "@/components/product/page-header";
import { SearchFilter } from "@/components/product/search-filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAtlasStore } from "@/stores/atlas-store";
import { useI18n } from "@/providers/language-provider";
import type { VaultItem, VaultKind } from "@/types/domain";

const icons = {
  link: LinkIcon,
  api_key: KeyRound,
  credential: LockKeyhole,
  note: StickyNote,
  snippet: StickyNote,
  doc: StickyNote,
};

export function VaultPage() {
  const { t } = useI18n();
  const vault = useAtlasStore((state) => state.vault);
  const addVaultItem = useAtlasStore((state) => state.addVaultItem);
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const filtered = vault.filter((item) => `${item.title} ${item.kind} ${item.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()));

  function submitVault(formData: FormData) {
    const item: VaultItem = {
      id: `vl_${Date.now()}`,
      kind: String(formData.get("kind")) as VaultKind,
      title: String(formData.get("title")),
      value: String(formData.get("value")),
      tags: String(formData.get("tags")).split(",").map((tag) => tag.trim()).filter(Boolean),
      updatedAt: "Just now",
    };
    addVaultItem(item);
    setOpen(false);
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4">
      <PageHeader
        eyebrow={t("vault.eyebrow")}
        title={t("vault.title")}
        description={t("vault.description")}
        actions={<Button size="sm" onClick={() => setOpen(true)}><CirclePlus className="size-3.5" />{t("vault.newItem")}</Button>}
      />
      <section className="grid gap-3 md:grid-cols-4">
        <MetricCard label="Vault items" value={String(vault.length)} delta="indexed" tone="outline" />
        <MetricCard label="Credentials" value={String(vault.filter((item) => item.kind === "credential").length)} delta="secure" />
        <MetricCard label="API keys" value={String(vault.filter((item) => item.kind === "api_key").length)} delta="masked" tone="warning" />
        <MetricCard label="Docs" value={String(vault.filter((item) => item.kind === "doc" || item.kind === "link").length)} delta="linked" />
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Vault library</CardTitle>
          <CardDescription>Fast search with masked values and secure references.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <SearchFilter value={query} onChange={setQuery} placeholder="Search secure references..." />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => {
              const Icon = icons[item.kind];
              return (
                <div key={item.id} className="rounded-lg border border-border bg-card p-3 shadow-sm transition-colors hover:bg-accent/30">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid size-8 place-items-center rounded-md border border-border bg-secondary"><Icon className="size-4 text-muted-foreground" /></div>
                      <div className="min-w-0">
                        <div className="truncate text-xs font-medium">{item.title}</div>
                        <div className="font-mono text-[11px] text-muted-foreground">{item.updatedAt}</div>
                      </div>
                    </div>
                    <Badge variant="outline">{item.kind.replace("_", " ")}</Badge>
                  </div>
                  <div className="mb-3 flex items-center gap-2 rounded-md border border-border bg-muted/20 px-2 py-2 font-mono text-[11px] text-muted-foreground">
                    <EyeOff className="size-3.5" />
                    <span className="min-w-0 flex-1 truncate">{item.value}</span>
                    <Copy className="size-3.5" />
                  </div>
                  <div className="flex flex-wrap gap-1">{item.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Vault item</DialogTitle><DialogDescription>Add a secure reference. Values are visually masked in the UI foundation.</DialogDescription></DialogHeader>
          <form action={submitVault} className="space-y-3">
            <Input name="title" placeholder="Title" required />
            <select name="kind" className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option value="link">Link</option><option value="api_key">API key</option><option value="credential">Credential</option><option value="note">Private note</option><option value="snippet">Snippet</option><option value="doc">Documentation</option>
            </select>
            <Input name="value" placeholder="Value or secure reference" required />
            <Input name="tags" placeholder="Tags comma separated" />
            <DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">Save item</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
