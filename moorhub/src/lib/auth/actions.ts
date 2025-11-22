"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Generic sign-out helper (can still be used programmatically)
export async function signOut(redirectTo = "/") {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect(redirectTo);
}

// Form-safe server action for sign-out (ignores posted FormData)
export async function signOutAction() {
  await signOut("/");
}
