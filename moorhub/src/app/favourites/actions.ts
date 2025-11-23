"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

type ActionState = { error?: string };

type FavoriteRow = { id: string };
type FavoriteInsert = { user_id: string; mooring_site_id: string };

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabaseAny = createClient() as any;

  const existing = await supabaseAny
    .from("favorites")
    .select("id")
    .eq("user_id", session.user.id)
    .eq("mooring_site_id", siteId)
    .maybeSingle();

  if (existing.error && existing.error.code !== "PGRST116") {
    return { error: existing.error.message };
  }

  if (existing.data) {
    const { error } = await supabaseAny.from("favorites").delete().eq("id", (existing.data as FavoriteRow).id);
    if (error) return { error: error.message };
  } else {
    const insertPayload: FavoriteInsert = { user_id: session.user.id, mooring_site_id: siteId };
    const { error } = await supabaseAny.from("favorites").insert(insertPayload);
    if (error) return { error: error.message };
  }

  revalidatePath(redirectTo);
  revalidatePath("/favourites");
  return {};
}
