import { AdminNav } from "./nav";

export default function AccountAdminIndex() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10 sm:px-10 space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent-2)]">Account admin</p>
        <h1 className="text-3xl font-semibold text-[color:var(--ink)]">Manage your account</h1>
        <p className="text-sm text-[color:var(--muted)]">Choose a section to manage mooring sites, berths, bookings, or contacts.</p>
      </div>
      <AdminNav />
      <div className="rounded-2xl border border-[color:var(--border)] bg-white p-6 text-sm text-[color:var(--muted)] shadow-sm">
        Select a section above to get started.
      </div>
    </main>
  );
}
