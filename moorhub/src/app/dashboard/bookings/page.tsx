import { requireSession } from "@/lib/auth/session";

export default async function BookingsPage() {
  await requireSession("/login");

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent-2)]">Bookings</p>
      <h1 className="text-2xl font-semibold text-[color:var(--ink)]">Your bookings</h1>
      <p className="text-sm text-[color:var(--muted)]">
        Track current and past bookings here. When booking is enabled, you’ll see confirmations and status
        updates in this space.
      </p>
    </div>
  );
}
