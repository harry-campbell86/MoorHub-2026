import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | MoorHub",
  description: "How MoorHub uses cookies and similar technologies.",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen px-6 py-12 sm:px-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--accent-2)]">
            MoorHub
          </p>
          <h1 className="text-3xl font-semibold text-[color:var(--ink)]">Cookie policy</h1>
          <p className="text-sm text-[color:var(--muted)]">
            A clear view of the cookies and similar tools we use to run and improve MoorHub.
          </p>
        </header>

        <section className="space-y-3 rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-[0_12px_30px_rgba(10,47,100,0.08)]">
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">Essential cookies</h2>
          <p className="text-sm text-[color:var(--muted)]">
            Used for security, session management, and maintaining your logged-in state. These cannot
            be switched off.
          </p>
        </section>

        <section className="space-y-3 rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-[0_12px_30px_rgba(10,47,100,0.08)]">
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">Analytics</h2>
          <p className="text-sm text-[color:var(--muted)]">
            Anonymised analytics help us understand which regions and listings matter most. You can
            opt out by adjusting your browser settings or using tracking protection.
          </p>
        </section>

        <section className="space-y-3 rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-[0_12px_30px_rgba(10,47,100,0.08)]">
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">Your control</h2>
          <p className="text-sm text-[color:var(--muted)]">
            Most browsers let you block or delete cookies. Note that essential cookies are needed to
            log in and manage listings.
          </p>
        </section>
      </div>
    </main>
  );
}
