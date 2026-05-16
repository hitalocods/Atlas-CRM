"use client";

import { ActivityTimeline } from "@/components/product/activity-timeline";
import { ProductivityBarChart, RevenueAreaChart } from "@/components/product/mini-chart";
import { MetricCard } from "@/components/product/metric-card";
import { PageHeader } from "@/components/product/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { useI18n } from "@/providers/language-provider";
import { useAtlasStore } from "@/stores/atlas-store";

const revenueData = [
  { month: "Jan", revenue: 12800, profit: 9200 },
  { month: "Feb", revenue: 14200, profit: 10100 },
  { month: "Mar", revenue: 13100, profit: 9400 },
  { month: "Apr", revenue: 17800, profit: 13200 },
  { month: "May", revenue: 21400, profit: 16200 },
  { month: "Jun", revenue: 23800, profit: 18100 },
];

const productivityData = [
  { day: "Mon", tasks: 8, focus: 5 },
  { day: "Tue", tasks: 12, focus: 7 },
  { day: "Wed", tasks: 9, focus: 6 },
  { day: "Thu", tasks: 14, focus: 8 },
  { day: "Fri", tasks: 11, focus: 6 },
  { day: "Sat", tasks: 5, focus: 3 },
  { day: "Sun", tasks: 4, focus: 2 },
];

export function AnalyticsPage() {
  const { t } = useI18n();
  const clients = useAtlasStore((state) => state.clients);
  const projects = useAtlasStore((state) => state.projects);
  const tasks = useAtlasStore((state) => state.tasks);
  const activities = useAtlasStore((state) => state.activities);
  const revenue = clients.reduce((sum, client) => sum + client.revenue, 0);
  const completion = Math.round((projects.filter((project) => project.status === "done").length / Math.max(projects.length, 1)) * 100);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4">
      <PageHeader
        eyebrow={t("analytics.eyebrow")}
        title={t("analytics.title")}
        description={t("analytics.description")}
      />
      <section className="grid gap-3 md:grid-cols-4">
        <MetricCard label="Tracked revenue" value={formatCurrency(revenue)} delta="+18%" />
        <MetricCard label="Active clients" value={String(clients.filter((client) => client.status === "active").length)} delta="+2" />
        <MetricCard label="Project completion" value={`${completion}%`} delta="on track" />
        <MetricCard label="Task throughput" value={String(tasks.filter((task) => task.status === "done").length)} delta="+9%" />
      </section>
      <section className="grid gap-3 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Revenue performance</CardTitle><CardDescription>Monthly revenue and profit trend.</CardDescription></CardHeader>
          <CardContent><RevenueAreaChart data={revenueData} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Productivity load</CardTitle><CardDescription>Tasks completed and focus blocks by day.</CardDescription></CardHeader>
          <CardContent><ProductivityBarChart data={productivityData} /></CardContent>
        </Card>
      </section>
      <section className="grid gap-3 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader><CardTitle>Portfolio health</CardTitle><CardDescription>High-level operating indicators.</CardDescription></CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {[
              ["Revenue concentration", "38%", "Largest client exposure"],
              ["Delivery confidence", "91%", "Schedule and scope signal"],
              ["Response latency", "2.4h", "Average client reply time"],
            ].map(([label, value, detail]) => (
              <div key={label} className="rounded-lg border border-border bg-muted/20 p-4">
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="mt-2 font-mono text-2xl font-semibold">{value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{detail}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <ActivityTimeline activities={activities.slice(0, 5)} title="System logs" />
      </section>
    </div>
  );
}
