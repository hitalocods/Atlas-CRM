"use client";

import * as React from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const axis = { stroke: "var(--muted-foreground)", fontSize: 10 };

export function RevenueAreaChart({ data }: { data: Array<{ month: string; revenue: number; profit: number }> }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-64 rounded-lg bg-muted/30" />;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="atlasRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={axis} />
          <YAxis tickLine={false} axisLine={false} tick={axis} width={34} />
          <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
          <Area type="monotone" dataKey="revenue" stroke="var(--primary)" fill="url(#atlasRevenue)" strokeWidth={2} />
          <Area type="monotone" dataKey="profit" stroke="var(--success)" fill="transparent" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProductivityBarChart({ data }: { data: Array<{ day: string; tasks: number; focus: number }> }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-56 rounded-lg bg-muted/30" />;
  }

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={axis} />
          <YAxis tickLine={false} axisLine={false} tick={axis} width={28} />
          <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
          <Bar dataKey="tasks" fill="var(--primary)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="focus" fill="var(--muted-foreground)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
