import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return { session: null, error };
  }
  return { session: data.user ? { user: data.user } : null, error: null };
}

export async function requireSession(redirectTo = "/login") {
  const { session } = await getSession();
  if (!session) {
    redirect(redirectTo);
  }
  return session;
}
