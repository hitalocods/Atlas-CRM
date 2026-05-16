"use client";

import { Bell, Bolt, CirclePlus, CreditCard, KeyRound, Menu, Search, SquareCheckBig, UsersRound, FolderKanban } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import type { ComponentType } from "react";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/features/auth/actions";
import { useI18n } from "@/providers/language-provider";
import { useUiStore } from "@/stores/ui-store";
import type { TranslationKey } from "@/lib/i18n/dictionaries";

const quickCreate: Array<{
  labelKey: TranslationKey;
  href: Route;
  icon: ComponentType<{ className?: string }>;
}> = [
  { labelKey: "shell.createClient", href: "/dashboard/crm", icon: UsersRound },
  { labelKey: "shell.createProject", href: "/dashboard/projects", icon: FolderKanban },
  { labelKey: "shell.createTask", href: "/dashboard/tasks", icon: SquareCheckBig },
  { labelKey: "shell.createPayment", href: "/dashboard/finance", icon: CreditCard },
  { labelKey: "shell.createVaultItem", href: "/dashboard/vault", icon: KeyRound },
];

export function TopNav() {
  const router = useRouter();
  const { t } = useI18n();
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/92 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/78 lg:px-4">
      <div className="flex min-w-0 items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
          <Menu className="size-4" />
          <span className="sr-only">Open navigation</span>
        </Button>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>Atlas</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("nav.dashboard")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="command" size="sm" className="hidden min-w-64 justify-start text-muted-foreground md:flex" onClick={() => setCommandOpen(true)}>
          <Search className="size-3.5" />
          {t("shell.search")}
          <kbd className="ml-auto rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">Ctrl K</kbd>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setCommandOpen(true)} className="md:hidden">
          <Search className="size-4" />
          <span className="sr-only">{t("common.search")}</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
              <CirclePlus className="size-3.5" />
              {t("shell.new")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>{t("shell.new")}</DropdownMenuLabel>
            {quickCreate.map((item) => (
              <DropdownMenuItem key={item.href} onClick={() => router.push(item.href)}>
                <item.icon className="size-3.5" />
                {t(item.labelKey)}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setCommandOpen(true)}>
              <Search className="size-3.5" />
              {t("shell.commandPalette")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Bell className="size-4" />
              <span className="sr-only">{t("shell.notifications")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel className="flex items-center justify-between">
              {t("shell.notifications")}
              <Badge variant="outline">3</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {["shell.notificationPayment", "shell.notificationProject", "shell.notificationVault"].map((item) => (
              <DropdownMenuItem key={item} className="items-start py-2">
                <span className="text-xs">{t(item as TranslationKey)}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <LanguageToggle />
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Bolt className="size-4" />
              <span className="sr-only">{t("shell.account")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>{t("shell.workspaces")}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>{t("shell.profile")}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard/finance")}>{t("shell.billing")}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <form action={signOut}>
              <DropdownMenuItem asChild>
                <button type="submit" className="w-full">
                  {t("shell.signOut")}
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
