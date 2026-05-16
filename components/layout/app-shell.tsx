"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/layout/command-palette";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { useUiStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);

  return (
    <div className="min-h-dvh bg-background">
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex">
        <Sidebar />
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/70 backdrop-blur-sm transition-opacity lg:hidden",
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setSidebarOpen(false)}
      />
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar />
        <Button variant="ghost" size="icon" className="absolute right-2 top-3" onClick={() => setSidebarOpen(false)}>
          <X className="size-4" />
          <span className="sr-only">Close navigation</span>
        </Button>
      </div>

      <div className="lg:pl-64">
        <TopNav />
        <main className="min-h-[calc(100dvh-3.5rem)] p-3 lg:p-4">{children}</main>
      </div>

      <CommandPalette />
    </div>
  );
}
