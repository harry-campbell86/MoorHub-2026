import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Login | MoorHub",
  description: "Sign in to manage your boat searches or marina listings.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen px-6 py-12 sm:px-10">
      <div className="mx-auto grid max-w-4xl gap-8 rounded-3xl border border-[color:var(--border)] bg-white p-8 shadow-[0_16px_40px_rgba(17,64,111,0.08)] md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--accent-2)]">Login</p>
          <h1 className="text-3xl font-semibold text-[color:var(--ink)]">Welcome back</h1>
          <p className="text-sm text-[color:var(--muted)]">
            Sign in to continue browsing moorings, save your boat details, or manage your marina
            listing.
          </p>
          <LoginForm />
        </div>
        <div className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-mid)]/70 p-6">
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">New to MoorHub?</h2>
          <p className="text-sm text-[color:var(--muted)]">
            Create an account to shortlist moorings, message marinas, and publish your availability.
          </p>
          <Link
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[color:var(--ink)] shadow-sm shadow-[rgba(10,47,100,0.08)] ring-1 ring-[color:var(--border)] transition hover:-translate-y-0.5 hover:shadow"
            href="/register"
          >
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
