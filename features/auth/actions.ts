"use server";

import { redirect } from "next/navigation";
import type { Route } from "next";
import { hasSupabaseEnv } from "@/services/supabase/env";
import { createClient } from "@/services/supabase/server";

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");
  const redirectTo = next.startsWith("/") ? (next as Route) : "/dashboard";

  if (!hasSupabaseEnv()) {
    redirect("/login?error=Supabase%20environment%20variables%20are%20not%20configured.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(redirectTo);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
