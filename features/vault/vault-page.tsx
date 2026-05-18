"use client";

import * as React from "react";
import { CirclePlus, Copy, Eye, EyeOff, KeyRound, LinkIcon, LockKeyhole, Pencil, StickyNote, Trash2 } from "lucide-react";
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
  const updateVaultItem = useAtlasStore((state) => state.updateVaultItem);
  const removeVaultItem = useAtlasStore((state) => state.removeVaultItem);
  const [query, setQuery] = React.useState("");
  const [editing, setEditing] = React.useState<VaultItem | null>(null);
  const [revealed, setRevealed] = React.useState<Record<string, boolean>>({});
  const filtered = vault.filter((item) => `${item.title} ${item.kind} ${item.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()));

  function submitVault(formData: FormData) {
    const item: VaultItem = {
      id: editing?.id || `vl_${Date.now()}`,
      kind: String(formData.get("kind")) as VaultKind,
      title: String(formData.get("title")),
      value: String(formData.get("value")),
      tags: String(formData.get("tags")).split(",").map((tag) => tag.trim()).filter(Boolean),
      updatedAt: "Just now",
    };
    if (editing?.id) updateVaultItem(item);
    else addVaultItem(item);
    setEditing(null);
  }

  async function copyValue(value: string) {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(value);
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4">
      <PageHeader
        eyebrow={t("vault.eyebrow")}
        title={t("vault.title")}
        description={t("vault.description")}
        actions={<Button size="sm" onClick={() => setEditing({ id: "", kind: "link", title: "", value: "", tags: [], updatedAt: "" })}><CirclePlus className="size-3.5" />{t("vault.newItem")}</Button>}
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
              const isRevealed = Boolean(revealed[item.id]);
              const displayValue = isRevealed ? item.value : "••••••••••••••••";
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
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 shrink-0"
                      aria-label={isRevealed ? "Hide value" : "Show value"}
                      title={isRevealed ? "Hide value" : "Show value"}
                      onClick={() => setRevealed((current) => ({ ...current, [item.id]: !current[item.id] }))}
                    >
                      {isRevealed ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </Button>
                    <span className="min-w-0 flex-1 truncate">{displayValue}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 shrink-0"
                      aria-label="Copy value"
                      title="Copy value"
                      onClick={() => copyValue(item.value)}
                    >
                      <Copy className="size-3.5" />
                    </Button>
                  </div>
                  <div className="flex items-end justify-between gap-2">
                    <div className="flex flex-wrap gap-1">{item.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}</div>
                    <div className="flex shrink-0 gap-1">
                      <Button type="button" variant="outline" size="icon" className="size-8" aria-label="Edit item" title="Edit item" onClick={() => setEditing(item)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button type="button" variant="outline" size="icon" className="size-8" aria-label="Delete item" title="Delete item" onClick={() => removeVaultItem(item.id)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Vault item</DialogTitle><DialogDescription>Add or edit links, API keys, credentials, notes and references.</DialogDescription></DialogHeader>
          {editing ? (
            <form action={submitVault} className="space-y-3">
              <Input name="title" defaultValue={editing.title} placeholder="Title" required />
              <select name="kind" defaultValue={editing.kind} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="link">Link</option><option value="api_key">API key</option><option value="credential">Credential</option><option value="note">Private note</option><option value="snippet">Snippet</option><option value="doc">Documentation</option>
              </select>
              <textarea
                name="value"
                defaultValue={editing.value}
                placeholder="Value, API key, link, note or secure reference"
                required
                className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <Input name="tags" defaultValue={editing.tags.join(", ")} placeholder="Tags comma separated" />
              <DialogFooter><Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit">Save item</Button></DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
