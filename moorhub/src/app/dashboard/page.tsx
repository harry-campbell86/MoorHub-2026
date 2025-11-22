import { requireSession } from "@/lib/auth/session";
import { ProfileForm } from "./ProfileForm";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const session = await requireSession("/login");
  const email = session.user.email ?? "your account";
  const name =
    (session.user.user_metadata as { full_name?: string | null })?.full_name ??
    session.user.user_metadata?.name ??
    "";
  const supabase = createClient();
  const profileRes = await supabase.from("consumers").select("full_name").eq("user_id", session.user.id).maybeSingle();
  const profileName = profileRes.data?.full_name ?? name;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent-2)]">Profile</p>
        <h1 className="text-2xl font-semibold text-[color:var(--ink)]">Welcome back</h1>
        <p className="text-sm text-[color:var(--muted)]">
          Signed in as <span className="font-semibold text-[color:var(--ink)]">{email}</span>. Update your
          details below.
        </p>
      </div>
      <ProfileForm email={email} name={profileName} />
      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-mid)]/50 p-4 text-sm text-[color:var(--muted)]">
        Tip: use the menu on the left (or “Menu” toggle on mobile) to reach Favourites, Bookings, and
        Settings.
      </div>
    </div>
  );
}
