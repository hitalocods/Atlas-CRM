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
        <div className="flex items-end justify-between gap-3">
          <CardTitle className="font-mono text-2xl">{value}</CardTitle>
          {delta ? <Badge variant={tone}>{delta}</Badge> : null}
        </div>
      </CardHeader>
      <CardContent>{children ?? <div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full w-2/3 rounded-full bg-primary/70" /></div>}</CardContent>
    </Card>
  );
}
