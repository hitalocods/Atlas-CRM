"use client";

import { Boxes, Eye, EyeOff, Filter, Plus, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/project-card";
import { ProjectForm } from "@/components/project-form";
import { Sidebar } from "@/components/sidebar";
import { SnippetPanel } from "@/components/snippet-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PROJECT_STATUSES, type VaultProject, type VaultSnippet } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type VaultShellProps = {
  projects: VaultProject[];
  snippets: VaultSnippet[];
};

function getStacks(projects: VaultProject[]) {
  return Array.from(
    new Set(
      projects.flatMap((project) =>
        project.stack
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    ),
  ).sort();
}

export function VaultShell({ projects, snippets }: VaultShellProps) {
  const [activeView, setActiveView] = useState("Dashboard");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");
  const [stack, setStack] = useState("Todas");
  const [hideValues, setHideValues] = useState(false);

  const stacks = useMemo(() => getStacks(projects), [projects]);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return projects.filter((project) => {
      const searchable = [
        project.name,
        project.client,
        project.description,
        project.status,
        project.projectType,
        project.stack,
        project.notes,
        project.promptUsed,
        project.problemsSolved,
        project.paymentStatus,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesQuery = normalizedQuery.length === 0 || searchable.includes(normalizedQuery);
      const matchesStatus = status === "Todos" || project.status === status;
      const matchesStack = stack === "Todas" || project.stack.toLowerCase().includes(stack.toLowerCase());
      const matchesView = activeView !== "Favoritos" || project.favorite;

      return matchesQuery && matchesStatus && matchesStack && matchesView;
    });
  }, [activeView, projects, query, stack, status]);

  const favoriteCount = projects.filter((project) => project.favorite).length;
  const productionCount = projects.filter((project) => project.status === "Em produção").length;
  const monthlyRevenue = projects
    .filter((project) => project.maintenanceActive && project.paymentStatus !== "Cancelado")
    .reduce((total, project) => total + (project.maintenanceValue ?? 0), 0);
  const signupRevenue = projects
    .filter((project) => project.paymentStatus !== "Cancelado")
    .reduce((total, project) => total + (project.projectValue ?? 0), 0);
  const activeProjects = projects.filter((project) => project.status === "Em produção" || project.status === "Em andamento").length;
  const activeMaintenances = projects.filter((project) => project.maintenanceActive).length;
  const pendingPayments = projects.filter((project) => project.paymentStatus === "Pendente" || project.paymentStatus === "Atrasado").length;
  const hiddenCurrency = "R$ •••";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="vault-grid pointer-events-none absolute inset-0" />
      <div className="relative flex min-h-screen">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border bg-background/70 px-4 py-4 backdrop-blur-xl md:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3 lg:hidden">
                <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/15 text-primary">
                  <Boxes className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Atlas Vault</p>
                  <p className="text-xs text-muted-foreground">Project OS</p>
                </div>
              </div>

              <div className="relative w-full xl:max-w-xl">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="pl-9"
                  placeholder="Buscar projetos, stacks, clientes, notas, problemas..."
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="h-10 rounded-md border border-input bg-background/55 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="Todos">Todos os status</option>
                  {PROJECT_STATUSES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <select
                  value={stack}
                  onChange={(event) => setStack(event.target.value)}
                  className="h-10 rounded-md border border-input bg-background/55 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="Todas">Todas as stacks</option>
                  {stacks.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus />
                      Novo Projeto
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Novo Projeto</DialogTitle>
                      <DialogDescription>Salve operação, financeiro, links, prompts e aprendizados em um registro leve.</DialogDescription>
                    </DialogHeader>
                    <ProjectForm />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </header>

          <div className="border-b border-border px-4 py-3 md:px-6 lg:hidden">
            <div className="flex gap-2 overflow-x-auto">
              {["Dashboard", "Projetos", "Snippets", "Tags", "Favoritos"].map((view) => (
                <Button
                  key={view}
                  type="button"
                  size="sm"
                  variant={activeView === view ? "secondary" : "ghost"}
                  onClick={() => setActiveView(view)}
                >
                  {view}
                </Button>
              ))}
            </div>
          </div>

          <section className="p-4 md:p-6">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mb-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <Badge variant="outline" className="mb-3 gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Local SQLite Vault
                  </Badge>
                  <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">Atlas Vault</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    OS de freelancer para projetos, financeiro, links, prompts, snippets e problemas resolvidos.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>{projects.length} projetos</span>
                    <span>•</span>
                    <span>{favoriteCount} favoritos</span>
                    <span>•</span>
                    <span>{productionCount} em produção</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center md:w-[640px] xl:grid-cols-5">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="col-span-2 justify-self-end xl:col-span-5"
                    onClick={() => setHideValues((current) => !current)}
                    aria-label={hideValues ? "Mostrar valores" : "Esconder valores"}
                    title={hideValues ? "Mostrar valores" : "Esconder valores"}
                  >
                    {hideValues ? <Eye /> : <EyeOff />}
                  </Button>
                  <div className="rounded-lg border border-border bg-card/70 p-3">
                    <p className="text-lg font-semibold">{hideValues ? hiddenCurrency : formatCurrency(monthlyRevenue)}</p>
                    <p className="text-xs text-muted-foreground">Receita mensal</p>
                  </div>
                  <div className="rounded-lg border border-border bg-card/70 p-3">
                    <p className="text-lg font-semibold">{hideValues ? hiddenCurrency : formatCurrency(signupRevenue)}</p>
                    <p className="text-xs text-muted-foreground">Adesão total</p>
                  </div>
                  <div className="rounded-lg border border-border bg-card/70 p-3">
                    <p className="text-xl font-semibold">{activeProjects}</p>
                    <p className="text-xs text-muted-foreground">Projetos ativos</p>
                  </div>
                  <div className="rounded-lg border border-border bg-card/70 p-3">
                    <p className="text-xl font-semibold">{activeMaintenances}</p>
                    <p className="text-xs text-muted-foreground">Manutenções ativas</p>
                  </div>
                  <div className="rounded-lg border border-border bg-card/70 p-3">
                    <p className="text-xl font-semibold">{pendingPayments}</p>
                    <p className="text-xs text-muted-foreground">Pagamentos pendentes</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {activeView === "Snippets" ? (
              <SnippetPanel snippets={snippets} />
            ) : (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Filter className="h-4 w-4" />
                    {filteredProjects.length} projeto(s) encontrados
                  </div>
                  {activeView === "Tags" ? (
                    <div className="flex flex-wrap gap-2">
                      {stacks.map((item) => (
                        <Badge key={item} variant="outline">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} hideValues={hideValues} />
                  ))}
                </div>

                {filteredProjects.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border bg-card/50 p-10 text-center">
                    <p className="font-medium">Nenhum projeto encontrado</p>
                    <p className="mt-2 text-sm text-muted-foreground">Ajuste a busca ou crie um novo projeto.</p>
                  </div>
                ) : null}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
