"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type FormState = { error?: string };

export async function login(_prevState: FormState, formData: FormData): Promise<FormState> {
  const email = (formData.get("email") ?? "").toString().trim();
  const password = (formData.get("password") ?? "").toString();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}
