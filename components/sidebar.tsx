"use client";

import { Boxes, Code2, Gauge, Heart, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const items = [
  { id: "Dashboard", icon: Gauge },
  { id: "Projetos", icon: Boxes },
  { id: "Snippets", icon: Code2 },
  { id: "Tags", icon: Tags },
  { id: "Favoritos", icon: Heart },
] as const;

type SidebarProps = {
  activeView: string;
  onViewChange: (view: string) => void;
};

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-background/60 p-4 backdrop-blur-xl lg:block">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/15 text-primary shadow-[0_0_30px_rgba(99,102,241,0.25)]">
          <Boxes className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold">Atlas Vault</p>
          <p className="text-xs text-muted-foreground">Project OS</p>
        </div>
      </div>

      <nav className="grid gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeView === item.id;
          return (
            <Button
              key={item.id}
              type="button"
              variant="ghost"
              className={cn("justify-start text-muted-foreground", active && "bg-accent text-foreground")}
              onClick={() => onViewChange(item.id)}
            >
              <Icon />
              {item.id}
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}
