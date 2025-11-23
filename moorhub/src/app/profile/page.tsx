import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await requireSession("/login");
  const supabase = createClient();

  const profileRes = await supabase
    .from("profiles")
    .select("full_name, email, phone, class, account_id")
    .eq("id", session.user.id)
    .maybeSingle();

  if (profileRes.error) {
    throw profileRes.error;
  }

  const profile = profileRes.data as {
    full_name: string | null;
    email: string | null;
    phone: string | null;
    class: string | null;
    account_id: string | null;
  } | null;

  let accountName: string | null = null;
  if (profile?.account_id) {
    const accountRes = await supabase.from("accounts").select("name").eq("id", profile.account_id).maybeSingle();
    if (!accountRes.error) {
      accountName = (accountRes.data as { name?: string } | null)?.name ?? null;
    }
  }

  const name = profile?.full_name ?? session.user.user_metadata.full_name ?? session.user.email ?? "";
  const email = profile?.email ?? session.user.email ?? "";
  const phone = profile?.phone ?? (session.user.user_metadata.phone as string | null) ?? "";
  const isContact = profile?.class === "contact";

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-10 sm:px-10">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent-2)]">My profile</p>
        <h1 className="text-3xl font-semibold text-[color:var(--ink)]">Manage your details</h1>
        <p className="text-sm text-[color:var(--muted)]">
          Update your contact details and password. Changes apply the next time you sign in.
        </p>
      </div>
      <ProfileForm
        defaultName={name}
        defaultEmail={email}
        defaultPhone={phone ?? ""}
        accountName={accountName ?? null}
        isContact={isContact}
      />
    </main>
  );
}
