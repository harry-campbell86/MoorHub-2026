"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

type ActionState = { error?: string; success?: string };

export async function updateMooringSite(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSession("/login");
  const supabase = createClient();

  const siteId = formData.get("site_id")?.toString() ?? "";
  const slugInput = formData.get("slug")?.toString().trim() ?? "";
  const name = formData.get("name")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const address = formData.get("address")?.toString().trim() ?? "";
  const status = formData.get("status")?.toString().trim() ?? "";

  if (!siteId) {
    return { error: "Missing site id." };
  }

  if (!name) {
    return { error: "Name is required." };
  }

  const slug = slugInput || slugify(name);

  const { error } = await supabase
    .from("mooring_sites")
    .update({
      name,
      description,
      address,
      status: status || "draft",
      slug,
      updated_at: new Date().toISOString(),
    })
    .eq("id", siteId); // RLS will enforce membership

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/mooring-sites");
  revalidatePath(`/dashboard/mooring-sites/${slug}`);
  revalidatePath(`/moorings/${slug}`);
  return { success: "Mooring site updated." };
}

function slugify(value: string) {
  const cleaned = value
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/(^-+|-+$)/g, "");
  return cleaned || `mooring-${crypto.randomUUID()}`;
}
