import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <section className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <Badge variant="outline">{eyebrow}</Badge>
          <span className="text-xs text-muted-foreground">Atlas OS</span>
        </div>
        <h1 className="text-xl font-semibold tracking-normal text-foreground">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </section>
  );
}
