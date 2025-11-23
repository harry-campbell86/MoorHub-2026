"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type ActionState = { error?: string; success?: string };
type ProfilesUpdatePayload = Database["public"]["Tables"]["profiles"]["Update"];

export async function updateProfile(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireSession("/login");
  const supabase = createClient();

  const fullName = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString().trim() ?? "";

  if (!fullName) return { error: "Name is required." };
  if (!email) return { error: "Email is required." };

  // Update profile record
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      email,
      phone: phone || null,
      updated_at: new Date().toISOString(),
    } as ProfilesUpdatePayload)
    .eq("id", session.user.id);

  if (profileError) {
    return { error: profileError.message };
  }

  // Update auth user (email/password/metadata) if provided
  const authUpdates: { email?: string; password?: string; data?: Record<string, unknown> } = {
    data: { full_name: fullName, phone: phone || null },
  };
  if (password) authUpdates.password = password;
  if (email && email !== session.user.email) authUpdates.email = email;

  const { error: authError } = await supabase.auth.updateUser(authUpdates);
  if (authError) {
    return { error: authError.message };
  }

  revalidatePath("/profile");
  return { success: "Profile updated." };
}
