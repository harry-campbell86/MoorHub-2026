import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { ContactsList } from "../ContactsList";

export default async function ContactsPage() {
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

  if (!accountId) {
    return (
      <div className="space-y-3 rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[color:var(--ink)]">No account access</h2>
        <p className="text-sm text-[color:var(--muted)]">Your profile is not linked to an account.</p>
      </div>
    );
  }

  const contactsRes = await supabase
    .from("profiles")
    .select("id, full_name, email, phone")
    .eq("account_id", accountId)
    .order("full_name", { ascending: true });
  if (contactsRes.error) throw contactsRes.error;
  const contacts = (contactsRes.data ?? []) as Array<{
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
  }>;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-[color:var(--ink)]">Contacts</h2>
        <p className="text-sm text-[color:var(--muted)]">People linked to this account.</p>
      </div>
      <ContactsList contacts={contacts} canEdit={Boolean(profile?.is_account_admin)} />
    </div>
  );
}
