"use client";

import * as React from "react";
import { Bell, CalendarDays, CirclePlus } from "lucide-react";
import { MetricCard } from "@/components/product/metric-card";
import { PageHeader } from "@/components/product/page-header";
import { SearchFilter } from "@/components/product/search-filter";
import { PriorityBadge } from "@/components/product/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useI18n } from "@/providers/language-provider";
import { useAtlasStore } from "@/stores/atlas-store";
import type { Priority, Task, TaskStatus } from "@/types/domain";

export function TasksPage() {
  const { t } = useI18n();
  const tasks = useAtlasStore((state) => state.tasks);
  const projects = useAtlasStore((state) => state.projects);
  const addTask = useAtlasStore((state) => state.addTask);
  const updateTask = useAtlasStore((state) => state.updateTask);
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const filtered = tasks.filter((task) => task.title.toLowerCase().includes(query.toLowerCase()));
  const priorityLabel = (priority: Priority) => t(`priority.${priority}` as const);
  const statusLabel = (status: TaskStatus) => t(`status.${status}` as const);

  function submitTask(formData: FormData) {
    const now = Date.now();
    const checklist = String(formData.get("checklist") ?? "")
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((title, index) => ({ id: `tk_${now}_${index}`, title, done: false }));

    addTask({
      id: `tk_${now}`,
      title: String(formData.get("title")),
      description: String(formData.get("description") ?? ""),
      projectId: String(formData.get("projectId")) || undefined,
      status: "todo",
      priority: String(formData.get("priority")) as Priority,
      due: String(formData.get("due")),
      reminder: String(formData.get("reminder")),
      checklist,
    });
    setOpen(false);
  }

  function toggleChecklistItem(task: Task, itemId: string, done: boolean) {
    const checklist = (task.checklist ?? []).map((item) => (item.id === itemId ? { ...item, done } : item));
    const nextStatus = checklist.length > 0 && checklist.every((item) => item.done) ? "done" : task.status === "done" ? "in_progress" : task.status;

    updateTask({ ...task, checklist, status: nextStatus });
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4">
      <PageHeader
        eyebrow={t("tasks.eyebrow")}
        title={t("tasks.title")}
        description={t("tasks.description")}
        actions={<Button size="sm" onClick={() => setOpen(true)}><CirclePlus className="size-3.5" />{t("tasks.quickTask")}</Button>}
      />
      <section className="grid gap-3 md:grid-cols-4">
        <MetricCard label={t("tasks.openTasks")} value={String(tasks.filter((task) => task.status !== "done").length)} delta="+7" />
        <MetricCard label={t("tasks.dueToday")} value={String(tasks.filter((task) => task.due === "Today" || task.due === t("common.today")).length)} delta={t("tasks.now")} tone="warning" />
        <MetricCard label={t("tasks.linkedToProjects")} value={String(tasks.filter((task) => task.projectId).length)} delta={t("tasks.mapped")} tone="outline" />
        <MetricCard label={t("tasks.completed")} value={String(tasks.filter((task) => task.status === "done").length)} delta="+3" />
      </section>
      <section className="grid gap-3 xl:grid-cols-[1fr_340px]">
        <Card>
          <CardHeader>
            <CardTitle>{t("tasks.taskList")}</CardTitle>
            <CardDescription>{t("tasks.listDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <SearchFilter value={query} onChange={setQuery} placeholder={t("tasks.searchPlaceholder")} />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("nav.tasks")}</TableHead>
                  <TableHead>{t("tasks.project")}</TableHead>
                  <TableHead>{t("common.priority")}</TableHead>
                  <TableHead>{t("tasks.reminder")}</TableHead>
                  <TableHead>{t("common.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((task) => {
                  const checklist = task.checklist ?? [];
                  const completedItems = checklist.filter((item) => item.done).length;

                  return (
                    <TableRow key={task.id}>
                      <TableCell className="min-w-72">
                        <div className="font-medium text-foreground">{task.title}</div>
                        {task.description ? <p className="mt-1 text-xs text-muted-foreground">{task.description}</p> : null}
                        {checklist.length > 0 ? (
                          <div className="mt-2 space-y-1">
                            <div className="text-[11px] font-medium text-muted-foreground">
                              {t("common.checklist")}: {completedItems}/{checklist.length}
                            </div>
                            {checklist.map((item) => (
                              <label key={item.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <input
                                  type="checkbox"
                                  checked={item.done}
                                  onChange={(event) => toggleChecklistItem(task, item.id, event.target.checked)}
                                  className="size-3.5 rounded border-border"
                                />
                                <span className={item.done ? "line-through opacity-70" : ""}>{item.title}</span>
                              </label>
                            ))}
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{projects.find((project) => project.id === task.projectId)?.title ?? t("common.personal")}</TableCell>
                      <TableCell><PriorityBadge priority={task.priority} label={priorityLabel(task.priority)} /></TableCell>
                      <TableCell className="font-mono text-muted-foreground">{task.reminder}</TableCell>
                      <TableCell>
                        <select
                          value={task.status}
                          onChange={(event) => updateTask({ ...task, status: event.target.value as TaskStatus })}
                          className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                        >
                          <option value="todo">{t("status.todo")}</option>
                          <option value="in_progress">{t("status.in_progress")}</option>
                          <option value="done">{t("status.done")}</option>
                        </select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("tasks.calendarSupport")}</CardTitle>
            <CardDescription>{t("tasks.calendarDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 p-3">
                <div className="grid size-8 place-items-center rounded-md border border-border bg-card"><CalendarDays className="size-4 text-muted-foreground" /></div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium">{task.title}</div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground"><Bell className="size-3" />{task.due} - {task.reminder}</div>
                </div>
                <Badge variant={task.status === "done" ? "success" : "outline"}>{statusLabel(task.status)}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("tasks.quickTask")}</DialogTitle>
            <DialogDescription>{t("tasks.quickTaskDescription")}</DialogDescription>
          </DialogHeader>
          <form action={submitTask} className="space-y-3">
            <Input name="title" placeholder={t("tasks.taskTitle")} required />
            <textarea
              name="description"
              placeholder={t("tasks.descriptionPlaceholder")}
              className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <textarea
              name="checklist"
              placeholder={t("tasks.checklistPlaceholder")}
              className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <select name="projectId" className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option value="">{t("common.personal")}</option>
              {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
            </select>
            <div className="grid gap-3 sm:grid-cols-3">
              <select name="priority" defaultValue="medium" className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                <option value="low">{t("priority.low")}</option>
                <option value="medium">{t("priority.medium")}</option>
                <option value="high">{t("priority.high")}</option>
                <option value="urgent">{t("priority.urgent")}</option>
              </select>
              <Input name="due" placeholder={t("tasks.due")} defaultValue={t("common.today")} />
              <Input name="reminder" placeholder={t("tasks.reminder")} defaultValue="09:00" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
              <Button type="submit">{t("tasks.createTask")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
