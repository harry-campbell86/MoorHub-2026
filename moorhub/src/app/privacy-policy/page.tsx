import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | MoorHub",
  description: "How MoorHub handles your data, cookies, and platform privacy practices.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen px-6 py-12 sm:px-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--accent-2)]">
            MoorHub
          </p>
          <h1 className="text-3xl font-semibold text-[color:var(--ink)]">Privacy policy</h1>
          <p className="text-sm text-[color:var(--muted)]">
            How we collect, use, and protect information for boat owners and marina partners using
            MoorHub.
          </p>
        </header>

        <section className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-[0_12px_30px_rgba(10,47,100,0.08)]">
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">What we collect</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-[color:var(--muted)]">
            <li>Account details: name, email, optional phone.</li>
            <li>
              Listing details: marina name, berth specs, pricing bands, and availability signals you
              provide.
            </li>
            <li>
              Usage data: pages viewed and actions taken to help us improve search relevance and
              reduce spam.
            </li>
          </ul>
        </section>

        <section className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-[0_12px_30px_rgba(10,47,100,0.08)]">
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">How we use it</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-[color:var(--muted)]">
            <li>Run the directory and match boats to marinas by fit, region, and stay length.</li>
            <li>Communicate about inquiries, support, onboarding, and service updates.</li>
            <li>Improve product performance, anti-spam, and safety for all users.</li>
          </ul>
        </section>

        <section className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-[0_12px_30px_rgba(10,47,100,0.08)]">
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">Your choices</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-[color:var(--muted)]">
            <li>Update or delete your account by contacting support@moorhub.com.</li>
            <li>Request data access or export for the personal data we hold.</li>
            <li>Opt out of marketing emails at any time; service emails will still be sent.</li>
          </ul>
        </section>

        <section className="space-y-3 rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-[0_12px_30px_rgba(10,47,100,0.08)]">
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">Questions?</h2>
          <p className="text-sm text-[color:var(--muted)]">
            Contact support@moorhub.com for any privacy questions or data requests.
          </p>
        </section>
      </div>
    </main>
  );
}
