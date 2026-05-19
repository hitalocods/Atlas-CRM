import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  delta,
  tone = "success",
  children,
}: {
  label: string;
  value: string;
  delta?: string;
  tone?: "success" | "warning" | "outline" | "default";
  children?: ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <div className="flex min-w-0 items-end justify-between gap-3">
          <CardTitle className="min-w-0 break-words font-mono text-xl sm:text-2xl">{value}</CardTitle>
          {delta ? <Badge variant={tone} className="shrink-0">{delta}</Badge> : null}
        </div>
      </CardHeader>
      <CardContent>{children ?? <div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full w-2/3 rounded-full bg-primary/70" /></div>}</CardContent>
    </Card>
  );
}
