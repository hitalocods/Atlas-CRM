"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { AtlasLogo } from "@/components/brand/atlas-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { primaryNav, utilityNav, workspaceNav } from "@/components/layout/nav-data";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/language-provider";

export function Sidebar({ className }: { className?: string }) {
  const { t } = useI18n();

  return (
    <aside className={cn("flex h-dvh w-64 shrink-0 flex-col border-r border-border bg-panel text-panel-foreground", className)}>
      <div className="flex h-14 items-center gap-3 border-b border-border px-3">
        <AtlasLogo className="size-7" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">Atlas</div>
          <div className="truncate text-[11px] text-muted-foreground">{t("shell.subtitle")}</div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-7">
              <ChevronDown className="size-3.5" />
              <span className="sr-only">Switch workspace</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuLabel>{t("shell.workspaces")}</DropdownMenuLabel>
            {workspaceNav.map((item) => (
              <DropdownMenuItem key={item.title}>
                <item.icon className="size-3.5" />
                {item.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <div className="space-y-0.5">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex h-8 items-center gap-2 rounded-md px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <item.icon className="size-3.5" />
              <span>{t(item.titleKey)}</span>
            </Link>
          ))}
        </div>

        <Separator className="my-3" />

        <div className="px-2 pb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{t("shell.workspaces")}</div>
        <div className="space-y-0.5">
          {workspaceNav.map((item) => (
            <button
              key={item.title}
              className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <item.icon className="size-3.5" />
              <span className="min-w-0 flex-1 truncate">{item.title}</span>
              <Badge variant={item.status === "Live" ? "success" : "outline"} className="px-1.5 py-0 text-[10px]">
                {item.status}
              </Badge>
            </button>
          ))}
        </div>
      </nav>

      <div className="border-t border-border p-2">
        {utilityNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex h-8 items-center gap-2 rounded-md px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <item.icon className="size-3.5" />
            <span>{t(item.titleKey)}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
