import { ReactNode } from "react";
import { AdminNav } from "./nav";

export default function AccountAdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10 sm:px-10 space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent-2)]">Account admin</p>
        <h1 className="text-3xl font-semibold text-[color:var(--ink)]">Manage your account</h1>
        <p className="text-sm text-[color:var(--muted)]">Mooring sites, berths, bookings, and contacts.</p>
      </div>
      <AdminNav />
      {children}
    </main>
  );
}
