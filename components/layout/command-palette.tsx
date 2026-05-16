"use client";

import { useRouter } from "next/navigation";
import type { Route } from "next";
import type { ComponentType } from "react";
import { BarChart3, CalendarDays, CirclePlus, CreditCard, FileText, FolderKanban, Inbox, KeyRound, LayoutGrid, Search, Settings, SquareCheckBig, UsersRound } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useI18n } from "@/providers/language-provider";
import { useUiStore } from "@/stores/ui-store";
import type { TranslationKey } from "@/lib/i18n/dictionaries";

const destinations: Array<{
  label: string;
  labelKey: TranslationKey;
  href: Route;
  icon: ComponentType<{ className?: string }>;
  shortcut: string;
}> = [
  { label: "Dashboard", labelKey: "nav.dashboard", href: "/dashboard", icon: LayoutGrid, shortcut: "G D" },
  { label: "CRM", labelKey: "nav.crm", href: "/dashboard/crm", icon: UsersRound, shortcut: "G R" },
  { label: "Projects", labelKey: "nav.projects", href: "/dashboard/projects", icon: FolderKanban, shortcut: "G P" },
  { label: "Tasks", labelKey: "nav.tasks", href: "/dashboard/tasks", icon: SquareCheckBig, shortcut: "G T" },
  { label: "Finance", labelKey: "nav.finance", href: "/dashboard/finance", icon: CreditCard, shortcut: "G F" },
  { label: "Vault", labelKey: "nav.vault", href: "/dashboard/vault", icon: KeyRound, shortcut: "G V" },
  { label: "Analytics", labelKey: "nav.analytics", href: "/dashboard/analytics", icon: BarChart3, shortcut: "G A" },
  { label: "Inbox", labelKey: "nav.inbox", href: "/dashboard/inbox", icon: Inbox, shortcut: "G I" },
  { label: "Calendar", labelKey: "nav.calendar", href: "/dashboard/calendar", icon: CalendarDays, shortcut: "G C" },
  { label: "Settings", labelKey: "nav.settings", href: "/dashboard/settings", icon: Settings, shortcut: "G S" },
];

export function CommandPalette() {
  const router = useRouter();
  const { t } = useI18n();
  const open = useUiStore((state) => state.commandOpen);
  const setOpen = useUiStore((state) => state.setCommandOpen);

  useKeyboardShortcuts();

  function run(command: () => void) {
    setOpen(false);
    command();
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={t("shell.search")} />
      <CommandList>
        <CommandEmpty>No command found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {destinations.map((item) => (
            <CommandItem key={item.href} onSelect={() => run(() => router.push(item.href))}>
              <item.icon />
              <span>{t(item.labelKey)}</span>
              <CommandShortcut>{item.shortcut}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => run(() => undefined)}>
            <CirclePlus />
            <span>Create project</span>
            <CommandShortcut>N P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => run(() => undefined)}>
            <FileText />
            <span>Capture note</span>
            <CommandShortcut>N N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => run(() => undefined)}>
            <Search />
            <span>Open universal search</span>
            <CommandShortcut>/</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
