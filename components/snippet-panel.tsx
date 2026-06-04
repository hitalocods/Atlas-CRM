"use client";

import { Check, Copy, Plus, Star, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { createSnippetAction, deleteSnippetAction, toggleSnippetFavoriteAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SNIPPET_CATEGORIES, type VaultSnippet } from "@/lib/types";

type SnippetPanelProps = {
  snippets: VaultSnippet[];
};

function getTags(snippets: VaultSnippet[]) {
  return Array.from(
    new Set(
      snippets.flatMap((snippet) =>
        (snippet.tag ?? "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    ),
  ).sort();
}

export function SnippetPanel({ snippets }: SnippetPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [tag, setTag] = useState("Todas");
  const tags = useMemo(() => getTags(snippets), [snippets]);

  const filteredSnippets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return snippets.filter((snippet) => {
      const searchable = [snippet.title, snippet.content, snippet.category, snippet.tag].filter(Boolean).join(" ").toLowerCase();
      const matchesQuery = normalizedQuery.length === 0 || searchable.includes(normalizedQuery);
      const matchesCategory = category === "Todas" || snippet.category === category;
      const matchesTag = tag === "Todas" || (snippet.tag ?? "").toLowerCase().includes(tag.toLowerCase());

      return matchesQuery && matchesCategory && matchesTag;
    });
  }, [category, query, snippets, tag]);

  async function copySnippet(snippet: VaultSnippet) {
    await navigator.clipboard.writeText(snippet.content);
    setCopiedId(snippet.id);
    window.setTimeout(() => setCopiedId(null), 1200);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <form action={createSnippetAction} className="rounded-lg border border-border bg-card/75 p-5">
        <div className="mb-5 flex items-center gap-2">
          <Plus className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Biblioteca reutilizável</h3>
        </div>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="snippet-title">Título</Label>
            <Input id="snippet-title" name="title" required placeholder="Prompt dashboard premium" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="snippet-category">Categoria</Label>
              <select
                id="snippet-category"
                name="category"
                defaultValue="Código"
                className="h-10 w-full rounded-md border border-input bg-background/55 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {SNIPPET_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="snippet-tag">Tags</Label>
              <Input id="snippet-tag" name="tag" placeholder="codex, prisma, deploy" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="snippet-content">Conteúdo</Label>
            <Textarea id="snippet-content" name="content" required placeholder="Cole prompt, comando, config, template, copy ou ideia" />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input name="favorite" type="checkbox" className="h-4 w-4 accent-primary" />
            Favorito
          </label>
          <Button type="submit">Salvar item</Button>
        </div>
      </form>

      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-card/75 p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_160px_160px]">
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar prompts, comandos, configs..." />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-10 rounded-md border border-input bg-background/55 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="Todas">Todas</option>
              {SNIPPET_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              className="h-10 rounded-md border border-input bg-background/55 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="Todas">Todas as tags</option>
              {tags.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-3">
          {filteredSnippets.map((snippet) => (
            <article key={snippet.id} className="rounded-lg border border-border bg-card/75 p-4 transition duration-300 hover:border-primary/35 hover:bg-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium">{snippet.title}</h3>
                    <Badge variant="outline">{snippet.category}</Badge>
                    {snippet.favorite ? <Badge variant="success">Favorito</Badge> : null}
                  </div>
                  {snippet.tag ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {snippet.tag.split(",").map((item) => (
                        <Badge key={item.trim()} variant="outline">
                          {item.trim()}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <form action={toggleSnippetFavoriteAction}>
                    <input type="hidden" name="id" value={snippet.id} />
                    <input type="hidden" name="favorite" value={String(snippet.favorite)} />
                    <Button type="submit" variant="ghost" size="icon" aria-label="Favoritar snippet">
                      <Star className={snippet.favorite ? "fill-primary text-primary" : "text-muted-foreground"} />
                    </Button>
                  </form>
                  <Button type="button" variant="ghost" size="icon" onClick={() => copySnippet(snippet)} aria-label="Copiar snippet">
                    {copiedId === snippet.id ? <Check /> : <Copy />}
                  </Button>
                  <form action={deleteSnippetAction}>
                    <input type="hidden" name="id" value={snippet.id} />
                    <Button type="submit" variant="ghost" size="icon" aria-label="Excluir snippet">
                      <Trash2 />
                    </Button>
                  </form>
                </div>
              </div>
              <pre className="mt-4 overflow-x-auto rounded-md border border-border bg-background/60 p-3 font-mono text-xs leading-5 text-muted-foreground">
                {snippet.content}
              </pre>
            </article>
          ))}
          {filteredSnippets.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-card/50 p-8 text-center">
              <p className="font-medium">Nenhum snippet encontrado</p>
              <p className="mt-2 text-sm text-muted-foreground">Ajuste a busca ou salve um novo item reutilizável.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
