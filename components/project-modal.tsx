import { CalendarDays, ExternalLink, Github, Trash2 } from "lucide-react";
import { deleteProjectAction } from "@/app/actions";
import { ProjectCover } from "@/components/project-cover";
import { ProjectForm } from "@/components/project-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { VaultProject } from "@/lib/types";
import { cn, formatCurrency, getPaymentStatusColor, getProjectTypeColor } from "@/lib/utils";

type ProjectModalProps = {
  project: VaultProject;
  hideValues?: boolean;
};

function stackItems(stack: string) {
  return stack
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function textItems(value: string | null) {
  return (value ?? "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDate(value: string | null) {
  if (!value) return "Sem vencimento";

  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
}

export function ProjectModal({ project, hideValues = false }: ProjectModalProps) {
  const hiddenCurrency = "R$ •••";
  const maintenanceText = project.maintenanceActive ? `${hideValues ? hiddenCurrency : formatCurrency(project.maintenanceValue)}/mês` : "Sem manutenção";

  return (
    <div className="space-y-6">
      <DialogHeader>
        <div className="flex flex-wrap items-center gap-2 pr-8">
          <DialogTitle>{project.name}</DialogTitle>
          <Badge variant={project.status === "Em produção" ? "success" : "default"}>{project.status}</Badge>
          <Badge variant="outline" className={getProjectTypeColor(project.projectType ?? "Web")}>
            {project.projectType ?? "Web"}
          </Badge>
          <Badge variant="outline" className={getPaymentStatusColor(project.paymentStatus ?? "Pendente")}>
            {project.paymentStatus ?? "Pendente"}
          </Badge>
        </div>
        <DialogDescription>{project.client ? `Cliente: ${project.client}` : "Projeto pessoal"}</DialogDescription>
      </DialogHeader>

      <div className="grid gap-3">
        <ProjectCover
          projectName={project.name}
          className="aspect-[16/9]"
          sizes="(min-width: 768px) 760px, 100vw"
          alt={`Preview principal do projeto ${project.name}`}
        />
      </div>

      <section className="rounded-lg border border-border bg-background/35 p-4">
        <h4 className="text-sm font-medium">Financeiro</h4>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-md border border-border bg-card/60 p-3">
            <p className="text-xs text-muted-foreground">Projeto</p>
            <p className="mt-1 text-lg font-semibold">{hideValues ? hiddenCurrency : formatCurrency(project.projectValue)}</p>
          </div>
          <div className="rounded-md border border-border bg-card/60 p-3">
            <p className="text-xs text-muted-foreground">Manutenção</p>
            <p className={cn("mt-1 text-lg font-semibold", project.maintenanceActive ? "text-emerald-300" : "text-muted-foreground")}>{maintenanceText}</p>
          </div>
          <div className="rounded-md border border-border bg-card/60 p-3">
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="mt-1 text-lg font-semibold">{project.paymentStatus ?? "Pendente"}</p>
          </div>
          <div className="rounded-md border border-border bg-card/60 p-3">
            <p className="text-xs text-muted-foreground">Próximo vencimento</p>
            <p className="mt-1 text-lg font-semibold">{formatDate(project.nextPaymentDate)}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-lg border border-border bg-background/35 p-4">
          <h4 className="text-sm font-medium">Descrição</h4>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{project.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {stackItems(project.stack).map((item) => (
              <Badge key={item} variant="outline">
                {item}
              </Badge>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-background/35 p-4">
          <h4 className="text-sm font-medium">Links</h4>
          <div className="mt-3 grid gap-2">
            {project.githubUrl ? (
              <Button asChild variant="outline" className="justify-start">
                <a href={project.githubUrl} target="_blank" rel="noreferrer">
                  <Github />
                  GitHub
                </a>
              </Button>
            ) : null}
            {project.deployUrl ? (
              <Button asChild variant="outline" className="justify-start">
                <a href={project.deployUrl} target="_blank" rel="noreferrer">
                  <ExternalLink />
                  Deploy
                </a>
              </Button>
            ) : null}
            {!project.githubUrl && !project.deployUrl ? <p className="text-sm text-muted-foreground">Nenhum link salvo.</p> : null}
          </div>
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-lg border border-border bg-background/35 p-4">
          <h4 className="text-sm font-medium">Prompt usado</h4>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{project.promptUsed || "Nenhum prompt cadastrado."}</p>
        </section>

        <section className="rounded-lg border border-border bg-background/35 p-4">
          <h4 className="text-sm font-medium">Problemas resolvidos</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {textItems(project.problemsSolved).length > 0 ? (
              textItems(project.problemsSolved).map((item) => (
                <Badge key={item} variant="outline">
                  {item}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum problema cadastrado.</p>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-border bg-background/35 p-4">
        <h4 className="text-sm font-medium">Timeline</h4>
        <div className="mt-4 space-y-3">
          {project.timeline.length > 0 ? (
            project.timeline.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shadow-[0_0_18px_rgba(99,102,241,0.6)]" />
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(item.createdAt)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum evento registrado.</p>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-background/35 p-4">
        <h4 className="text-sm font-medium">Notas</h4>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{project.notes || "Nenhuma nota cadastrada."}</p>
      </section>

      <section className="rounded-lg border border-border bg-background/35 p-4">
        <h4 className="mb-4 text-sm font-medium">Editar projeto</h4>
        <ProjectForm project={project} />
      </section>

      <form action={deleteProjectAction} className="flex justify-end">
        <input type="hidden" name="id" value={project.id} />
        <Button type="submit" variant="destructive">
          <Trash2 />
          Excluir projeto
        </Button>
      </form>
    </div>
  );
}
