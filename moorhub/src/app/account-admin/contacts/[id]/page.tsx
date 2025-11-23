import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import ContactEditForm from "./ContactEditForm";

export default async function EditContactPage({ params }: { params: { id: string } }) {
  const session = await requireSession("/login");
  const supabase = createClient();

  const profileRes = await supabase
    .from("profiles")
    .select("account_id, is_account_admin")
    .eq("id", session.user.id)
    .maybeSingle();
  if (profileRes.error) throw profileRes.error;
  const profile = profileRes.data as { account_id: string | null; is_account_admin: boolean | null } | null;
  const accountId = profile?.account_id ?? null;

  if (!accountId) notFound();
  if (!profile?.is_account_admin) {
    return (
      <div className="rounded-2xl border border-[color:var(--border)] bg-white p-6 text-sm text-[color:var(--muted)] shadow-sm">
        You do not have permission to edit contacts.
      </div>
    );
  }

  const contactRes = await supabase
    .from("profiles")
    .select("id, full_name, email, phone")
    .eq("id", params.id)
    .eq("account_id", accountId)
    .maybeSingle();
  if (contactRes.error) throw contactRes.error;
  const contact = contactRes.data as { id: string; full_name: string | null; email: string | null; phone: string | null } | null;
  if (!contact) notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent-2)]">Edit contact</p>
          <h2 className="text-2xl font-semibold text-[color:var(--ink)]">{contact.full_name ?? "Contact"}</h2>
        </div>
        <Link
          href="/account-admin/contacts"
          className="text-sm font-semibold text-[color:var(--accent)] underline-offset-2 hover:underline"
        >
          Back to contacts
        </Link>
      </div>

      <ContactEditForm contact={contact} />
    </div>
  );
}
