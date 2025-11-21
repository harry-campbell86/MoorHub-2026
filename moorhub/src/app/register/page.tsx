import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register | MoorHub",
  description: "Create an account to search moorings, save boats, or list your marina on MoorHub.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen px-6 py-12 sm:px-10">
      <div className="mx-auto grid max-w-4xl gap-8 rounded-3xl border border-[color:var(--border)] bg-white p-8 shadow-[0_16px_40px_rgba(17,64,111,0.08)] md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--accent-2)]">Register</p>
          <h1 className="text-3xl font-semibold text-[color:var(--ink)]">Create your account</h1>
          <p className="text-sm text-[color:var(--muted)]">
            One login for both sides of MoorHub: search long-stay moorings or manage your marina
            listing.
          </p>
          <form className="space-y-4">
            <label className="block space-y-2 text-sm text-[color:var(--muted)]">
              <span className="font-semibold text-[color:var(--ink)]">Full name</span>
              <input
                className="w-full rounded-2xl border border-[color:var(--border)] px-4 py-3 text-[color:var(--ink)] shadow-inner shadow-[rgba(17,64,111,0.04)] focus:border-[color:var(--accent)] focus:outline-none"
                type="text"
                name="name"
                placeholder="Alex Skipper"
              />
            </label>
            <label className="block space-y-2 text-sm text-[color:var(--muted)]">
              <span className="font-semibold text-[color:var(--ink)]">Email</span>
              <input
                className="w-full rounded-2xl border border-[color:var(--border)] px-4 py-3 text-[color:var(--ink)] shadow-inner shadow-[rgba(17,64,111,0.04)] focus:border-[color:var(--accent)] focus:outline-none"
                type="email"
                name="email"
                placeholder="you@example.com"
              />
            </label>
            <label className="block space-y-2 text-sm text-[color:var(--muted)]">
              <span className="font-semibold text-[color:var(--ink)]">Password</span>
              <input
                className="w-full rounded-2xl border border-[color:var(--border)] px-4 py-3 text-[color:var(--ink)] shadow-inner shadow-[rgba(17,64,111,0.04)] focus:border-[color:var(--accent)] focus:outline-none"
                type="password"
                name="password"
                placeholder="••••••••"
              />
            </label>
            <label className="block space-y-2 text-sm text-[color:var(--muted)]">
              <span className="font-semibold text-[color:var(--ink)]">Confirm password</span>
              <input
                className="w-full rounded-2xl border border-[color:var(--border)] px-4 py-3 text-[color:var(--ink)] shadow-inner shadow-[rgba(17,64,111,0.04)] focus:border-[color:var(--accent)] focus:outline-none"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
              />
            </label>
            <button
              className="w-full rounded-full bg-[color:var(--accent)] px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-[rgba(5,167,159,0.3)] transition hover:-translate-y-0.5 hover:shadow"
              type="submit"
            >
              Create account
            </button>
            <p className="text-xs text-[color:var(--muted)]">
              By creating an account you agree to our{" "}
              <Link className="underline" href="/terms">
                Terms
              </Link>{" "}
              and{" "}
              <Link className="underline" href="/privacy-policy">
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        </div>
        <div className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-mid)]/70 p-6">
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">Already have an account?</h2>
          <p className="text-sm text-[color:var(--muted)]">
            Pick up where you left off with saved searches and marina listings.
          </p>
          <Link
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[color:var(--ink)] shadow-sm shadow-[rgba(10,47,100,0.08)] ring-1 ring-[color:var(--border)] transition hover:-translate-y-0.5 hover:shadow"
            href="/login"
          >
            Go to login
          </Link>
        </div>
      </div>
    </main>
  );
}
