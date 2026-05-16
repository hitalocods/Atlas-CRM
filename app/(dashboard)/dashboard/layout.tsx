import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { hasSupabaseEnv } from "@/services/supabase/env";
import { createClient } from "@/services/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!hasSupabaseEnv()) {
    return <AppShell>{children}</AppShell>;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}
