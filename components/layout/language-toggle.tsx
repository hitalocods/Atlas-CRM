"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/providers/language-provider";

export function LanguageToggle() {
  const { locale, setLocale, t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="size-4" />
          <span className="sr-only">{t("shell.language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("shell.language")}</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setLocale("en")}>English {locale === "en" ? "(active)" : ""}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocale("pt-BR")}>Portugues {locale === "pt-BR" ? "(ativo)" : ""}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
