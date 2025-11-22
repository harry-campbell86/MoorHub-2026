import { requireSession } from "@/lib/auth/session";

export default async function SettingsPage() {
  await requireSession("/login");

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent-2)]">Settings</p>
      <h1 className="text-2xl font-semibold text-[color:var(--ink)]">Account settings</h1>
      <p className="text-sm text-[color:var(--muted)]">
        Manage notifications, security preferences, and linked services here as features roll out.
      </p>
    </div>
  );
}
