import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | null | undefined) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export function getPaymentStatusColor(status: string) {
  const colors: Record<string, string> = {
    Pago: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    Pendente: "border-amber-400/25 bg-amber-400/10 text-amber-300",
    Atrasado: "border-red-400/25 bg-red-400/10 text-red-300",
    Cancelado: "border-zinc-400/25 bg-zinc-400/10 text-zinc-300",
  };

  return colors[status] ?? colors.Pendente;
}

export function getProjectTypeColor(type: string) {
  const colors: Record<string, string> = {
    Dashboard: "border-sky-400/25 bg-sky-400/10 text-sky-300",
    Landing: "border-fuchsia-400/25 bg-fuchsia-400/10 text-fuchsia-300",
    App: "border-indigo-400/25 bg-indigo-400/10 text-indigo-300",
    Site: "border-cyan-400/25 bg-cyan-400/10 text-cyan-300",
    Web: "border-primary/25 bg-primary/10 text-primary",
  };

  return colors[type] ?? colors.Web;
}
