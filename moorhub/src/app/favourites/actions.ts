"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

type ActionState = { error?: string };

export async function toggleFavorite(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const siteId = formData.get("site_id")?.toString();
  const redirectTo = (formData.get("redirect_to")?.toString() || "/search").replace(/[\n\r]/g, "");
  return toggleFavoriteInternal(siteId, redirectTo);
}

export async function toggleFavoriteDirect(siteId: string, redirectTo = "/search"): Promise<ActionState> {
  return toggleFavoriteInternal(siteId, redirectTo);
}

async function toggleFavoriteInternal(siteId?: string, redirectTo = "/search"): Promise<ActionState> {
  if (!siteId) {
    return { error: "Missing mooring site id." };
  }

  const session = await requireSession("/login");
  const supabase = createClient();

  const existing = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", session.user.id)
    .eq("mooring_site_id", siteId)
    .maybeSingle();

  if (existing.error && existing.error.code !== "PGRST116") {
    return { error: existing.error.message };
  }

  if (existing.data) {
    const { error } = await supabase.from("favorites").delete().eq("id", existing.data.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("favorites").insert({
      user_id: session.user.id,
      mooring_site_id: siteId,
    });
    if (error) return { error: error.message };
  }

  revalidatePath(redirectTo);
  revalidatePath("/dashboard/favourites");
  return {};
}
