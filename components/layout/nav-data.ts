import type { Route } from "next";
import type { ComponentType } from "react";
import type { TranslationKey } from "@/lib/i18n/dictionaries";
import {
  Activity,
  BarChart3,
  CalendarDays,
  CircleDot,
  Command,
  CreditCard,
  Files,
  FolderKanban,
  Home,
  Inbox,
  KeyRound,
  Settings,
  Sparkles,
  SquareCheckBig,
  UsersRound,
} from "lucide-react";

type NavItem = {
  title: string;
  titleKey: TranslationKey;
  href: Route;
  icon: ComponentType<{ className?: string }>;
};

export const primaryNav: NavItem[] = [
  { title: "Home", titleKey: "nav.dashboard", href: "/dashboard", icon: Home },
  { title: "CRM", titleKey: "nav.crm", href: "/dashboard/crm", icon: UsersRound },
  { title: "Projects", titleKey: "nav.projects", href: "/dashboard/projects", icon: FolderKanban },
  { title: "Tasks", titleKey: "nav.tasks", href: "/dashboard/tasks", icon: SquareCheckBig },
  { title: "Finance", titleKey: "nav.finance", href: "/dashboard/finance", icon: CreditCard },
  { title: "Vault", titleKey: "nav.vault", href: "/dashboard/vault", icon: KeyRound },
  { title: "Analytics", titleKey: "nav.analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { title: "Inbox", titleKey: "nav.inbox", href: "/dashboard/inbox", icon: Inbox },
  { title: "Calendar", titleKey: "nav.calendar", href: "/dashboard/calendar", icon: CalendarDays },
  { title: "Files", titleKey: "nav.files", href: "/dashboard/files", icon: Files },
  { title: "Activity", titleKey: "nav.activity", href: "/dashboard/activity", icon: Activity },
];

export const workspaceNav = [
  { title: "Personal OS", status: "Live", icon: CircleDot },
  { title: "Creator Stack", status: "Draft", icon: Sparkles },
  { title: "Ops Board", status: "Review", icon: Command },
];

export const utilityNav: NavItem[] = [{ title: "Settings", titleKey: "nav.settings", href: "/dashboard/settings", icon: Settings }];
