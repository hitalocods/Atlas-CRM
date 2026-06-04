"use client";

import { Calendar, ExternalLink, Github, Star } from "lucide-react";
import { motion } from "framer-motion";
import { toggleFavoriteAction } from "@/app/actions";
import { ProjectCover } from "@/components/project-cover";
import { ProjectModal } from "@/components/project-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { VaultProject } from "@/lib/types";
import { cn, formatCurrency, getPaymentStatusColor, getProjectTypeColor } from "@/lib/utils";

type ProjectCardProps = {
  project: VaultProject;
  hideValues?: boolean;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function stackItems(stack: string) {
  return stack
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);
}

export function ProjectCard({ project, hideValues = false }: ProjectCardProps) {
  const hiddenCurrency = "R$ •••";

  return (
    <Dialog>
      <motion.article whileHover={{ y: -3 }} transition={{ duration: 0.18 }}>
        <div className="group relative h-full overflow-hidden rounded-lg border border-border bg-card/80 shadow-sm shadow-black/20 transition duration-300 hover:border-primary/40 hover:bg-card hover:shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
          <div className="absolute inset-x-4 top-0 z-10 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition group-hover:opacity-100" />
          <DialogTrigger asChild>
            <button className="group block w-full text-left">
              <ProjectCover projectName={project.name} className="aspect-[16/9] rounded-none" />
            </button>
          </DialogTrigger>

          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <DialogTrigger asChild>
                <button className="min-w-0 text-left">
                  <h3 className="truncate text-base font-semibold text-foreground">{project.name}</h3>
                  <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">{project.description}</p>
                </button>
              </DialogTrigger>
              <form action={toggleFavoriteAction}>
                <input type="hidden" name="id" value={project.id} />
                <input type="hidden" name="favorite" value={String(project.favorite)} />
                <Button type="submit" size="icon" variant="ghost" aria-label="Favoritar projeto">
                  <Star className={project.favorite ? "fill-primary text-primary" : "text-muted-foreground"} />
                </Button>
              </form>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant={project.status === "Em produção" ? "success" : "secondary"}>{project.status}</Badge>
              <Badge variant="outline" className={getProjectTypeColor(project.projectType ?? "Web")}>
                {project.projectType ?? "Web"}
              </Badge>
              <Badge variant="outline" className={getPaymentStatusColor(project.paymentStatus ?? "Pendente")}>
                {project.paymentStatus ?? "Pendente"}
              </Badge>
              {stackItems(project.stack).map((item) => (
                <Badge key={item} variant="outline">
                  {item}
                </Badge>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 rounded-md border border-border bg-background/35 p-3">
              <div>
                <p className="text-[11px] text-muted-foreground">Projeto</p>
                <p className="mt-1 text-sm font-semibold">{hideValues ? hiddenCurrency : formatCurrency(project.projectValue)}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">Manutenção</p>
                <p className={cn("mt-1 text-sm font-semibold", project.maintenanceActive ? "text-emerald-300" : "text-muted-foreground")}>
                  {project.maintenanceActive ? `${hideValues ? hiddenCurrency : formatCurrency(project.maintenanceValue)}/mês` : "Sem manutenção"}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(project.createdAt)}
              </span>
              <div className="relative z-20 flex items-center gap-1">
                {project.githubUrl ? (
                  <Button asChild type="button" variant="ghost" size="icon" className="h-8 w-8" title="Abrir GitHub">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Abrir GitHub de ${project.name}`}
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                ) : null}
                {project.deployUrl ? (
                  <Button asChild type="button" variant="ghost" size="icon" className="h-8 w-8" title="Abrir projeto">
                    <a
                      href={project.deployUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Abrir deploy de ${project.name}`}
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </motion.article>
      <DialogContent>
        <ProjectModal project={project} hideValues={hideValues} />
      </DialogContent>
    </Dialog>
  );
}
