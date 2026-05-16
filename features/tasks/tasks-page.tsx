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
import { useAtlasStore } from "@/stores/atlas-store";
import { useI18n } from "@/providers/language-provider";
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

  function submitTask(formData: FormData) {
    addTask({
      id: `tk_${Date.now()}`,
      title: String(formData.get("title")),
      projectId: String(formData.get("projectId")) || undefined,
      status: "todo",
      priority: String(formData.get("priority")) as Priority,
      due: String(formData.get("due")),
      reminder: String(formData.get("reminder")),
    });
    setOpen(false);
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
        <MetricCard label="Open tasks" value={String(tasks.filter((task) => task.status !== "done").length)} delta="+7" />
        <MetricCard label="Due today" value={String(tasks.filter((task) => task.due === "Today").length)} delta="now" tone="warning" />
        <MetricCard label="Linked to projects" value={String(tasks.filter((task) => task.projectId).length)} delta="mapped" tone="outline" />
        <MetricCard label="Completed" value={String(tasks.filter((task) => task.status === "done").length)} delta="+3" />
      </section>
      <section className="grid gap-3 xl:grid-cols-[1fr_340px]">
        <Card>
          <CardHeader>
            <CardTitle>Task list</CardTitle>
            <CardDescription>Fast filtering with inline status updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <SearchFilter value={query} onChange={setQuery} placeholder="Search tasks..." />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Reminder</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium text-foreground">{task.title}</TableCell>
                    <TableCell className="text-muted-foreground">{projects.find((project) => project.id === task.projectId)?.title ?? "Personal"}</TableCell>
                    <TableCell><PriorityBadge priority={task.priority} /></TableCell>
                    <TableCell className="font-mono text-muted-foreground">{task.reminder}</TableCell>
                    <TableCell>
                      <select
                        value={task.status}
                        onChange={(event) => updateTask({ ...task, status: event.target.value as TaskStatus })}
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                      >
                        <option value="todo">Todo</option>
                        <option value="in_progress">In progress</option>
                        <option value="done">Done</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Calendar support</CardTitle>
            <CardDescription>Reminder-aware day view.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 p-3">
                <div className="grid size-8 place-items-center rounded-md border border-border bg-card"><CalendarDays className="size-4 text-muted-foreground" /></div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium">{task.title}</div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground"><Bell className="size-3" />{task.due} · {task.reminder}</div>
                </div>
                <Badge variant={task.status === "done" ? "success" : "outline"}>{task.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Quick task</DialogTitle><DialogDescription>Create a task with reminder and optional project link.</DialogDescription></DialogHeader>
          <form action={submitTask} className="space-y-3">
            <Input name="title" placeholder="Task title" required />
            <select name="projectId" className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option value="">Personal</option>
              {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
            </select>
            <div className="grid gap-3 sm:grid-cols-3">
              <select name="priority" defaultValue="medium" className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
              </select>
              <Input name="due" placeholder="Due" defaultValue="Today" />
              <Input name="reminder" placeholder="Reminder" defaultValue="09:00" />
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">Create task</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
