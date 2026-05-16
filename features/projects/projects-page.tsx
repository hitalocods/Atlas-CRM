"use client";

import * as React from "react";
import { DndContext, type DragEndEvent, PointerSensor, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, CirclePlus, MessageSquare, Paperclip } from "lucide-react";
import { MetricCard } from "@/components/product/metric-card";
import { PageHeader } from "@/components/product/page-header";
import { PriorityBadge, ProjectStatusBadge } from "@/components/product/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAtlasStore } from "@/stores/atlas-store";
import { useI18n } from "@/providers/language-provider";
import type { Priority, Project, ProjectStatus } from "@/types/domain";

const columns: Array<{ id: ProjectStatus; title: string; description: string }> = [
  { id: "backlog", title: "Backlog", description: "Captured ideas" },
  { id: "planned", title: "Planned", description: "Committed work" },
  { id: "in_progress", title: "In progress", description: "Active execution" },
  { id: "review", title: "Review", description: "Awaiting feedback" },
  { id: "done", title: "Done", description: "Shipped" },
];

function ProjectCard({ project }: { project: Project }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`rounded-lg border border-border bg-card p-3 shadow-sm transition-colors hover:bg-accent/40 ${isDragging ? "opacity-70" : ""}`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-xs font-medium text-foreground">{project.title}</div>
          <div className="truncate text-[11px] text-muted-foreground">{project.client}</div>
        </div>
        <PriorityBadge priority={project.priority} />
      </div>
      <div className="mb-3 flex flex-wrap gap-1">
        {project.labels.map((label) => <Badge key={label} variant="outline">{label}</Badge>)}
      </div>
      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary/70" style={{ width: `${project.progress}%` }} />
      </div>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1"><CalendarDays className="size-3" />{project.deadline}</span>
        <span className="flex items-center gap-2">
          <span className="flex items-center gap-1"><MessageSquare className="size-3" />{project.comments}</span>
          <span className="flex items-center gap-1"><Paperclip className="size-3" />{project.attachments}</span>
        </span>
      </div>
    </div>
  );
}

function ProjectColumn({
  column,
  projects,
}: {
  column: { id: ProjectStatus; title: string; description: string };
  projects: Project[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <Card ref={setNodeRef} className={`min-w-72 transition-colors ${isOver ? "bg-accent/30" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>{column.title}</CardTitle>
          <ProjectStatusBadge status={column.id} />
        </div>
        <CardDescription>{column.description} · {projects.length}</CardDescription>
      </CardHeader>
      <CardContent>
        <SortableContext items={projects.map((project) => project.id)} strategy={verticalListSortingStrategy}>
          <div className="min-h-80 space-y-2">
            {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
          </div>
        </SortableContext>
      </CardContent>
    </Card>
  );
}

export function ProjectsPage() {
  const { t } = useI18n();
  const projects = useAtlasStore((state) => state.projects);
  const addProject = useAtlasStore((state) => state.addProject);
  const moveProject = useAtlasStore((state) => state.moveProject);
  const [open, setOpen] = React.useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  function onDragEnd(event: DragEndEvent) {
    const projectId = String(event.active.id);
    const overId = event.over?.id;
    if (!overId) return;
    const status = columns.some((column) => column.id === overId) ? overId : projects.find((project) => project.id === overId)?.status;
    if (status) moveProject(projectId, status as ProjectStatus);
  }

  function submitProject(formData: FormData) {
    const project: Project = {
      id: `pr_${Date.now()}`,
      title: String(formData.get("title")),
      client: String(formData.get("client")),
      status: "backlog",
      priority: String(formData.get("priority")) as Priority,
      deadline: String(formData.get("deadline")),
      progress: Number(formData.get("progress") || 0),
      labels: String(formData.get("labels")).split(",").map((label) => label.trim()).filter(Boolean),
      comments: 0,
      attachments: 0,
      subtasks: 0,
    };
    addProject(project);
    setOpen(false);
  }

  return (
    <div className="mx-auto flex max-w-[1500px] flex-col gap-4">
      <PageHeader
        eyebrow={t("projects.eyebrow")}
        title={t("projects.title")}
        description={t("projects.description")}
        actions={<Button size="sm" onClick={() => setOpen(true)}><CirclePlus className="size-3.5" />{t("projects.newProject")}</Button>}
      />

      <section className="grid gap-3 md:grid-cols-4">
        <MetricCard label="Active projects" value={String(projects.filter((project) => project.status !== "done").length)} delta="+4" />
        <MetricCard label="Avg progress" value={`${Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length)}%`} delta="+6%" />
        <MetricCard label="Urgent" value={String(projects.filter((project) => project.priority === "urgent").length)} delta="focus" tone="warning" />
        <MetricCard label="Attachments" value={String(projects.reduce((sum, project) => sum + project.attachments, 0))} delta="indexed" tone="outline" />
      </section>

      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <section className="grid gap-3 overflow-x-auto pb-2 xl:grid-cols-5">
          {columns.map((column) => (
            <ProjectColumn
              key={column.id}
              column={column}
              projects={projects.filter((project) => project.status === column.id)}
            />
          ))}
        </section>
      </DndContext>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
            <DialogDescription>Create a project shell with deadline, priority, labels and progress.</DialogDescription>
          </DialogHeader>
          <form action={submitProject} className="space-y-3">
            <Input name="title" placeholder="Project title" required />
            <Input name="client" placeholder="Client" required />
            <div className="grid gap-3 sm:grid-cols-3">
              <select name="priority" defaultValue="medium" className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <Input name="deadline" type="date" required />
              <Input name="progress" type="number" min="0" max="100" placeholder="Progress" />
            </div>
            <Input name="labels" placeholder="Labels comma separated" />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Create project</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
