"use client";

import { ArrowUpRight, CirclePlus, Command, CreditCard, FolderKanban, KeyRound, UsersRound } from "lucide-react";
import { ActivityTimeline } from "@/components/product/activity-timeline";
import { ProductivityBarChart } from "@/components/product/mini-chart";
import { MetricCard } from "@/components/product/metric-card";
import { PageHeader } from "@/components/product/page-header";
import { PriorityBadge, ProjectStatusBadge } from "@/components/product/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import { useI18n } from "@/providers/language-provider";
import { useAtlasStore } from "@/stores/atlas-store";
import { useUiStore } from "@/stores/ui-store";

const productivityData = [
  { day: "Mon", tasks: 8, focus: 5 },
  { day: "Tue", tasks: 12, focus: 7 },
  { day: "Wed", tasks: 9, focus: 6 },
  { day: "Thu", tasks: 14, focus: 8 },
  { day: "Fri", tasks: 11, focus: 6 },
  { day: "Sat", tasks: 5, focus: 3 },
  { day: "Sun", tasks: 4, focus: 2 },
];

export function DashboardPage() {
  const { t } = useI18n();
  const clients = useAtlasStore((state) => state.clients);
  const projects = useAtlasStore((state) => state.projects);
  const tasks = useAtlasStore((state) => state.tasks);
  const finances = useAtlasStore((state) => state.finances);
  const vault = useAtlasStore((state) => state.vault);
  const activities = useAtlasStore((state) => state.activities);
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);
  const revenue = finances.filter((record) => record.kind === "income").reduce((sum, record) => sum + record.amount, 0);
  const expenses = finances.filter((record) => record.kind === "expense").reduce((sum, record) => sum + record.amount, 0);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4">
      <PageHeader
        eyebrow={t("dashboard.eyebrow")}
        title={t("dashboard.title")}
        description={t("dashboard.description")}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setCommandOpen(true)}>
              <Command className="size-3.5" />
              Command menu
            </Button>
            <Button size="sm">
              <CirclePlus className="size-3.5" />
              Quick capture
            </Button>
          </>
        }
      />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label={t("dashboard.netProfit")} value={formatCurrency(revenue - expenses)} delta="+21%" />
        <MetricCard label={t("dashboard.activeClients")} value={String(clients.filter((client) => client.status === "active").length)} delta="+2" />
        <MetricCard label={t("dashboard.openProjects")} value={String(projects.filter((project) => project.status !== "done").length)} delta="+4" />
        <MetricCard label={t("dashboard.taskPressure")} value={String(tasks.filter((task) => task.status !== "done").length)} delta={t("common.today").toLowerCase()} tone="warning" />
      </section>

      <section className="grid gap-3 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>{t("dashboard.priorityWork")}</CardTitle>
              <CardDescription>Live project signals with deadlines, priority and completion.</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              Open board
              <ArrowUpRight className="size-3.5" />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.slice(0, 5).map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">{project.title}</div>
                      <div className="text-muted-foreground">{project.client}</div>
                    </TableCell>
                    <TableCell><ProjectStatusBadge status={project.status} /></TableCell>
                    <TableCell><PriorityBadge priority={project.priority} /></TableCell>
                    <TableCell className="font-mono text-muted-foreground">{project.progress}%</TableCell>
                    <TableCell className="text-right text-muted-foreground">{project.deadline}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-3">
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.quickActions")}</CardTitle>
              <CardDescription>Keyboard-friendly workflows.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              {[
                [UsersRound, "Create client", "CRM"],
                [FolderKanban, "Create project", "Board"],
                [CreditCard, "Log payment", "Finance"],
                [KeyRound, "Save secret", "Vault"],
              ].map(([Icon, label, scope]) => (
                <button key={String(label)} className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 p-3 text-left transition-colors hover:bg-accent">
                  <div className="grid size-8 place-items-center rounded-md border border-border bg-card"><Icon className="size-4 text-muted-foreground" /></div>
                  <span className="min-w-0 flex-1 text-xs font-medium">{String(label)}</span>
                  <Badge variant="outline">{String(scope)}</Badge>
                </button>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.systemDensity")}</CardTitle>
              <CardDescription>Connected records across Atlas.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {[
                ["Clients", clients.length],
                ["Projects", projects.length],
                ["Tasks", tasks.length],
                ["Vault", vault.length],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-lg border border-border bg-muted/20 p-3">
                  <div className="text-[11px] text-muted-foreground">{String(label)}</div>
                  <div className="font-mono text-xl font-semibold">{String(value)}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-3 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader><CardTitle>{t("dashboard.productivityInsight")}</CardTitle><CardDescription>Tasks completed and focus blocks.</CardDescription></CardHeader>
          <CardContent><ProductivityBarChart data={productivityData} /></CardContent>
        </Card>
        <ActivityTimeline activities={activities.slice(0, 5)} />
      </section>
    </div>
  );
}
