"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { error?: string; success?: string };

async function getProfile(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("account_id, class, is_account_admin")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as { account_id: string | null; class: string | null; is_account_admin: boolean | null } | null;
}

export async function createMooringSite(formData: FormData): Promise<void> {
  const session = await requireSession("/login");
  const supabase = createClient();
  const profile = await getProfile(session.user.id);
  if (!profile?.account_id) throw new Error("No account linked to your profile.");

  const name = formData.get("name")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const address = formData.get("address")?.toString().trim() ?? "";
  const status = formData.get("status")?.toString().trim() ?? "draft";

  if (!name) throw new Error("Name is required.");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("mooring_sites") as any).insert({
    account_id: profile.account_id,
    name,
    description: description || null,
    address: address || null,
    status,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/account-admin/sites");
}

export async function updateMooringSite(formData: FormData): Promise<void> {
  const session = await requireSession("/login");
  const supabase = createClient();
  const profile = await getProfile(session.user.id);
  if (!profile?.account_id) throw new Error("No account linked to your profile.");

  const siteId = formData.get("site_id")?.toString() ?? "";
  const name = formData.get("name")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const address = formData.get("address")?.toString().trim() ?? "";
  const status = formData.get("status")?.toString().trim() ?? "draft";

  if (!siteId) throw new Error("Missing site id.");
  if (!name) throw new Error("Name is required.");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("mooring_sites") as any)
    .update({
      name,
      description: description || null,
      address: address || null,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", siteId)
    .eq("account_id", profile.account_id);

  if (error) throw new Error(error.message);
  revalidatePath("/account-admin/sites");
}

export async function deleteMooringSite(formData: FormData): Promise<void> {
  const session = await requireSession("/login");
  const supabase = createClient();
  const profile = await getProfile(session.user.id);
  if (!profile?.account_id) throw new Error("No account linked to your profile.");

  const siteId = formData.get("site_id")?.toString() ?? "";
  if (!siteId) throw new Error("Missing site id.");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("mooring_sites") as any)
    .delete()
    .eq("id", siteId)
    .eq("account_id", profile.account_id);
  if (error) throw new Error(error.message);
  revalidatePath("/account-admin/sites");
}

export async function createContact(formData: FormData): Promise<void> {
  const session = await requireSession("/login");
  const supabase = createClient();
  const profile = await getProfile(session.user.id);
  if (!profile?.account_id) throw new Error("No account linked to your profile.");
  if (!profile.is_account_admin) throw new Error("You do not have permission to manage contacts.");

  const fullName = formData.get("full_name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";

  if (!fullName) throw new Error("Name is required.");
  if (!email) throw new Error("Email is required.");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("profiles") as any).insert({
    full_name: fullName,
    email,
    phone: phone || null,
    account_id: profile.account_id,
    class: "contact",
    is_account_admin: false,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/account-admin/contacts");
}

export async function updateContact(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireSession("/login");
  const supabase = createClient();
  const profile = await getProfile(session.user.id);
  if (!profile?.account_id) return { error: "No account linked to your profile." };
  if (!profile.is_account_admin) return { error: "You do not have permission to manage contacts." };

  const contactId = formData.get("contact_id")?.toString() ?? "";
  const fullName = formData.get("full_name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";

  if (!contactId) return { error: "Missing contact id." };
  if (!fullName) return { error: "Name is required." };
  if (!email) return { error: "Email is required." };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("profiles") as any)
    .update({
      full_name: fullName,
      email,
      phone: phone || null,
    })
    .eq("id", contactId)
    .eq("account_id", profile.account_id);

  if (error) return { error: error.message };
  revalidatePath("/account-admin/contacts");
  return { success: "Contact updated." };
}

export async function deleteContact(formData: FormData): Promise<void> {
  const session = await requireSession("/login");
  const supabase = createClient();
  const profile = await getProfile(session.user.id);
  if (!profile?.account_id) throw new Error("No account linked to your profile.");
  if (!profile.is_account_admin) throw new Error("You do not have permission to manage contacts.");

  const contactId = formData.get("contact_id")?.toString() ?? "";
  if (!contactId) throw new Error("Missing contact id.");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("profiles") as any)
    .delete()
    .eq("id", contactId)
    .eq("account_id", profile.account_id);
  if (error) throw new Error(error.message);
  revalidatePath("/account-admin/contacts");
}
