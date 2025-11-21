import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | MoorHub",
  description: "Terms for using MoorHub as a boat owner or marina listing partner.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen px-6 py-12 sm:px-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--accent-2)]">
            MoorHub
          </p>
          <h1 className="text-3xl font-semibold text-[color:var(--ink)]">Terms of service</h1>
          <p className="text-sm text-[color:var(--muted)]">
            The essentials for using MoorHub to browse moorings or list your marina.
          </p>
        </header>

        <section className="space-y-3 rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-[0_12px_30px_rgba(10,47,100,0.08)]">
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">Accounts & content</h2>
          <p className="text-sm text-[color:var(--muted)]">
            You are responsible for the accuracy of information submitted. Marina listings must be
            truthful, lawful, and updated when availability or pricing changes.
          </p>
        </section>

        <section className="space-y-3 rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-[0_12px_30px_rgba(10,47,100,0.08)]">
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">Directory service</h2>
          <p className="text-sm text-[color:var(--muted)]">
            MoorHub provides a directory and messaging starting point; agreements, payments, and
            compliance with local regulations remain between boat owners and marinas.
          </p>
        </section>

        <section className="space-y-3 rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-[0_12px_30px_rgba(10,47,100,0.08)]">
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">Acceptable use</h2>
          <p className="text-sm text-[color:var(--muted)]">
            No spam, scraping, or misuse of contact details. We may suspend accounts that violate
            these terms or put other users at risk.
          </p>
        </section>

        <section className="space-y-3 rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-[0_12px_30px_rgba(10,47,100,0.08)]">
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">Liability</h2>
          <p className="text-sm text-[color:var(--muted)]">
            The service is provided “as is” without warranties. MoorHub is not party to berth
            contracts between owners and marinas.
          </p>
        </section>

        <section className="space-y-3 rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-[0_12px_30px_rgba(10,47,100,0.08)]">
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">Contact</h2>
          <p className="text-sm text-[color:var(--muted)]">
            Questions about these terms? Email support@moorhub.com.
          </p>
        </section>
      </div>
    </main>
  );
}
