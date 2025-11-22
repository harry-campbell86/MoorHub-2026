"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type FormState = { error?: string; success?: string };

export async function updateProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = (formData.get("name") ?? "").toString().trim();
  const email = (formData.get("email") ?? "").toString().trim();
  const password = (formData.get("password") ?? "").toString();

  if (!name && !email && !password) {
    return { error: "Enter a name, email, or password to update." };
  }

  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated." };
  }

  const updates: Parameters<typeof supabase.auth.updateUser>[0] = {};

  if (name) {
    updates.data = { full_name: name };
  }
  if (email) {
    updates.email = email;
  }
  if (password) {
    if (password.length < 6) {
      return { error: "Password must be at least 6 characters." };
    }
    updates.password = password;
  }

  const { error } = await supabase.auth.updateUser(updates);
  if (error) {
    return { error: error.message };
  }

  if (name) {
    type ConsumerInsert = { user_id: string; full_name: string | null };
    const { error: consumerError } = await supabase
      .from<ConsumerInsert>("consumers")
      .upsert({ user_id: user.id, full_name: name || null }, { onConflict: "user_id" });

    if (consumerError) {
      return { error: consumerError.message };
    }
  }

  revalidatePath("/dashboard");
  return { success: "Profile updated. Check your inbox if you changed email." };
}
