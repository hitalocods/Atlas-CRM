"use client";

import * as React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/providers/language-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider delayDuration={250}>{children}</TooltipProvider>
      </LanguageProvider>
      <Toaster />
    </ThemeProvider>
  );
}
