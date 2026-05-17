"use client";

import * as React from "react";
import { DndContext, type DragEndEvent, PointerSensor, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, CirclePlus, DollarSign, MessageSquare, Paperclip, Pencil } from "lucide-react";
import { MetricCard } from "@/components/product/metric-card";
import { PageHeader } from "@/components/product/page-header";
import { PriorityBadge, ProjectStatusBadge } from "@/components/product/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/format";
import { useI18n } from "@/providers/language-provider";
import { createClient } from "@/services/supabase/browser";
import type { Database } from "@/types/database";
import type { Priority, Project, ProjectStatus } from "@/types/domain";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

const blankProject: Project = {
  id: "",
  title: "",
  client: "",
  value: 0,
  monthlyValue: 0,
  contractMonths: 0,
  status: "backlog",
  priority: "medium",
  deadline: "",
  progress: 0,
  labels: [],
  comments: 0,
  attachments: 0,
  subtasks: 0,
};

function mapProject(row: ProjectRow): Project {
  const attachments = Array.isArray(row.attachments) ? row.attachments.length : 0;

  return {
    id: row.id,
    title: row.title,
    client: row.client,
    value: Number(row.value ?? 0),
    monthlyValue: Number(row.monthly_value ?? 0),
    contractMonths: Number(row.contract_months ?? 0),
    status: row.status as ProjectStatus,
    priority: row.priority as Priority,
    deadline: row.deadline ?? "",
    progress: row.progress,
    labels: row.labels,
    comments: 0,
    attachments,
    subtasks: 0,
  };
}

function ProjectCard({
  project,
  onEdit,
  editLabel,
  priorityLabel,
  monthLabel,
}: {
  project: Project;
  onEdit: (project: Project) => void;
  editLabel: string;
  priorityLabel: string;
  monthLabel: string;
}) {
  const { attributes, listeners, setActivatorNodeRef, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border border-border bg-card p-3 shadow-sm transition-colors hover:bg-accent/40 ${isDragging ? "opacity-70" : ""}`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <button
          ref={setActivatorNodeRef}
          type="button"
          className="min-w-0 flex-1 cursor-grab text-left active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <div className="truncate text-xs font-medium text-foreground">{project.title}</div>
          <div className="truncate text-[11px] text-muted-foreground">{project.client}</div>
        </button>
        <div className="flex items-center gap-1">
          <PriorityBadge priority={project.priority} label={priorityLabel} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2"
            aria-label={editLabel}
            title={editLabel}
            onClick={(event) => {
              event.stopPropagation();
              onEdit(project);
            }}
          >
            <Pencil className="size-3.5" />
            <span className="hidden sm:inline">{editLabel}</span>
          </Button>
        </div>
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
          <span className="flex items-center gap-1"><DollarSign className="size-3" />{formatCurrency(project.value ?? 0)}</span>
          <span className="flex items-center gap-1">{formatCurrency(project.monthlyValue ?? 0)}/{monthLabel}</span>
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
  onEdit,
  editLabel,
  priorityLabel,
  monthLabel,
  statusLabel,
}: {
  column: { id: ProjectStatus; title: string; description: string };
  projects: Project[];
  onEdit: (project: Project) => void;
  editLabel: string;
  priorityLabel: (priority: Priority) => string;
  monthLabel: string;
  statusLabel: (status: ProjectStatus) => string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <Card ref={setNodeRef} className={`min-w-72 transition-colors ${isOver ? "bg-accent/30" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>{column.title}</CardTitle>
          <ProjectStatusBadge status={column.id} label={statusLabel(column.id)} />
        </div>
        <CardDescription>{column.description} · {projects.length}</CardDescription>
      </CardHeader>
      <CardContent>
        <SortableContext items={projects.map((project) => project.id)} strategy={verticalListSortingStrategy}>
          <div className="min-h-80 space-y-2">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={onEdit}
                editLabel={editLabel}
                priorityLabel={priorityLabel(project.priority)}
                monthLabel={monthLabel}
              />
            ))}
          </div>
        </SortableContext>
      </CardContent>
    </Card>
  );
}

export function ProjectsPage() {
  const { t } = useI18n();
  const supabase = React.useMemo(() => createClient() as any, []);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const [editing, setEditing] = React.useState<Project | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const totalValue = projects.reduce((sum, project) => sum + (project.value ?? 0), 0);
  const monthlyValue = projects.reduce((sum, project) => sum + (project.monthlyValue ?? 0), 0);
  const contractValue = projects.reduce((sum, project) => sum + (project.monthlyValue ?? 0) * (project.contractMonths ?? 0), 0);
  const columns: Array<{ id: ProjectStatus; title: string; description: string }> = [
    { id: "backlog", title: t("status.backlog"), description: t("projects.capturedIdeas") },
    { id: "planned", title: t("status.planned"), description: t("projects.committedWork") },
    { id: "in_progress", title: t("status.in_progress"), description: t("projects.activeExecution") },
    { id: "review", title: t("status.review"), description: t("projects.awaitingFeedback") },
    { id: "done", title: t("status.done"), description: t("projects.shipped") },
  ];
  const priorityLabel = (priority: Priority) => t(`priority.${priority}` as const);
  const statusLabel = (projectStatus: ProjectStatus) => t(`status.${projectStatus}` as const);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    let active = true;

    async function loadProjects() {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!active) return;

      if (userError || !user) {
        setError(userError?.message ?? "User session not found.");
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (projectsError) {
        setError(projectsError.message);
      } else {
        setProjects(((data ?? []) as ProjectRow[]).map(mapProject));
      }

      setLoading(false);
    }

    loadProjects();

    return () => {
      active = false;
    };
  }, [supabase]);

  async function onDragEnd(event: DragEndEvent) {
    const projectId = String(event.active.id);
    const overId = event.over?.id;
    if (!overId) return;
    const status = columns.some((column) => column.id === overId) ? overId : projects.find((project) => project.id === overId)?.status;
    if (!status) return;

    const previousProjects = projects;
    setProjects((current) => current.map((project) => (project.id === projectId ? { ...project, status: status as ProjectStatus } : project)));

    const { error: updateError } = await supabase
      .from("projects")
      .update({ status: status as ProjectStatus, updated_at: new Date().toISOString() })
      .eq("id", projectId);

    if (updateError) {
      setProjects(previousProjects);
      setError(updateError.message);
    }
  }

  async function submitProject(formData: FormData) {
    if (!userId) {
      setError("User session not found.");
      return;
    }

    setSaving(true);
    setError(null);

    const project: Project = {
      id: editing?.id || `pr_${Date.now()}`,
      title: String(formData.get("title")),
      client: String(formData.get("client")),
      value: Number(formData.get("value") || 0),
      monthlyValue: Number(formData.get("monthlyValue") || 0),
      contractMonths: Number(formData.get("contractMonths") || 0),
      status: String(formData.get("status") || "backlog") as ProjectStatus,
      priority: String(formData.get("priority")) as Priority,
      deadline: String(formData.get("deadline")),
      progress: Number(formData.get("progress") || 0),
      labels: String(formData.get("labels")).split(",").map((label) => label.trim()).filter(Boolean),
      comments: editing?.comments ?? 0,
      attachments: editing?.attachments ?? 0,
      subtasks: editing?.subtasks ?? 0,
    };

    if (editing?.id) {
      const { data, error: updateError } = await supabase
        .from("projects")
        .update({
          title: project.title,
          client: project.client,
          value: project.value,
          monthly_value: project.monthlyValue,
          contract_months: project.contractMonths,
          status: project.status,
          priority: project.priority,
          deadline: project.deadline || null,
          progress: project.progress,
          labels: project.labels,
          updated_at: new Date().toISOString(),
        })
        .eq("id", project.id)
        .select("*")
        .single();

      if (updateError) {
        setError(updateError.message);
      } else if (data) {
        setProjects((current) => current.map((item) => (item.id === project.id ? mapProject(data as ProjectRow) : item)));
        setEditing(null);
      }
    } else {
      const { data, error: insertError } = await supabase
        .from("projects")
        .insert({
          user_id: userId,
          title: project.title,
          client: project.client,
          value: project.value,
          monthly_value: project.monthlyValue,
          contract_months: project.contractMonths,
          status: project.status,
          priority: project.priority,
          deadline: project.deadline || null,
          progress: project.progress,
          labels: project.labels,
          attachments: [],
        })
        .select("*")
        .single();

      if (insertError) {
        setError(insertError.message);
      } else if (data) {
        setProjects((current) => [mapProject(data as ProjectRow), ...current]);
        setEditing(null);
      }
    }

    setSaving(false);
  }

  return (
    <div className="mx-auto flex max-w-[1500px] flex-col gap-4">
      <PageHeader
        eyebrow={t("projects.eyebrow")}
        title={t("projects.title")}
        description={t("projects.description")}
        actions={<Button size="sm" onClick={() => setEditing(blankProject)}><CirclePlus className="size-3.5" />{t("projects.newProject")}</Button>}
      />

      <section className="grid gap-3 md:grid-cols-4">
        <MetricCard label={t("projects.activeProjects")} value={String(projects.filter((project) => project.status !== "done").length)} delta="+4" />
        <MetricCard label={t("projects.projectValue")} value={formatCurrency(totalValue)} delta={t("projects.pipeline")} />
        <MetricCard label={t("projects.monthlyMaintenance")} value={formatCurrency(monthlyValue)} delta={t("projects.recurring")} />
        <MetricCard label={t("projects.contractValue")} value={formatCurrency(contractValue)} delta={t("projects.term")} tone="outline" />
      </section>

      {error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      ) : null}

      {mounted ? (
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
          <section className="grid gap-3 overflow-x-auto pb-2 xl:grid-cols-5">
            {columns.map((column) => (
              <ProjectColumn
                key={column.id}
                column={column}
                projects={projects.filter((project) => project.status === column.id)}
                onEdit={setEditing}
                editLabel={t("common.edit")}
                priorityLabel={priorityLabel}
                monthLabel={t("projects.month")}
                statusLabel={statusLabel}
              />
            ))}
          </section>
          {!loading && projects.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                {t("projects.empty")}
              </CardContent>
            </Card>
          ) : null}
        </DndContext>
      ) : (
        <section className="grid gap-3 overflow-x-auto pb-2 xl:grid-cols-5">
          {columns.map((column) => (
            <Card key={column.id} className="min-h-96 min-w-72" />
          ))}
        </section>
      )}

      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing?.id ? t("projects.editProject") : t("projects.newProject")}</DialogTitle>
            <DialogDescription>{t("projects.projectDialogDescription")}</DialogDescription>
          </DialogHeader>
          {editing ? (
            <form action={submitProject} className="space-y-3">
              <Input name="title" defaultValue={editing.title} placeholder={t("projects.projectTitle")} required />
              <Input name="client" defaultValue={editing.client} placeholder={t("projects.client")} required />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input name="value" defaultValue={editing.value} type="number" min="0" step="0.01" placeholder={t("projects.projectValue")} />
                <Input name="monthlyValue" defaultValue={editing.monthlyValue} type="number" min="0" step="0.01" placeholder={t("projects.monthlyMaintenance")} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input name="contractMonths" defaultValue={editing.contractMonths} type="number" min="0" step="1" placeholder={t("projects.contractMonths")} />
                <select name="status" defaultValue={editing.status} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                  {columns.map((column) => <option key={column.id} value={column.id}>{column.title}</option>)}
                </select>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <select name="priority" defaultValue={editing.priority} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="low">{t("priority.low")}</option>
                  <option value="medium">{t("priority.medium")}</option>
                  <option value="high">{t("priority.high")}</option>
                  <option value="urgent">{t("priority.urgent")}</option>
                </select>
                <Input name="deadline" defaultValue={editing.deadline} type="date" required />
                <Input name="progress" defaultValue={editing.progress} type="number" min="0" max="100" placeholder={t("common.progress")} />
              </div>
              <Input name="labels" defaultValue={editing.labels.join(", ")} placeholder={t("projects.labelsPlaceholder")} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>{t("common.cancel")}</Button>
                <Button type="submit" disabled={saving}>{saving ? t("common.saving") : editing.id ? t("projects.saveProject") : t("projects.createProject")}</Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
