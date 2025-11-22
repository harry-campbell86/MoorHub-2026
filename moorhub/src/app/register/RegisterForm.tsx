"use client";

import { useFormState } from "react-dom";
import { register } from "./actions";

const initialState = { error: undefined as string | undefined };

export function RegisterForm() {
  const [state, formAction] = useFormState(register, initialState);

  return (
    <form action={formAction} className="space-y-4">
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
          required
        />
      </label>
      <label className="block space-y-2 text-sm text-[color:var(--muted)]">
        <span className="font-semibold text-[color:var(--ink)]">Password</span>
        <input
          className="w-full rounded-2xl border border-[color:var(--border)] px-4 py-3 text-[color:var(--ink)] shadow-inner shadow-[rgba(17,64,111,0.04)] focus:border-[color:var(--accent)] focus:outline-none"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
      </label>
      <label className="block space-y-2 text-sm text-[color:var(--muted)]">
        <span className="font-semibold text-[color:var(--ink)]">Confirm password</span>
        <input
          className="w-full rounded-2xl border border-[color:var(--border)] px-4 py-3 text-[color:var(--ink)] shadow-inner shadow-[rgba(17,64,111,0.04)] focus:border-[color:var(--accent)] focus:outline-none"
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          required
        />
      </label>
      {state.error ? (
        <p className="text-sm font-semibold text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        className="w-full rounded-full bg-[color:var(--accent)] px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-[rgba(5,167,159,0.3)] transition hover:-translate-y-0.5 hover:shadow"
        type="submit"
      >
        Create account
      </button>
      <p className="text-xs text-[color:var(--muted)]">
        By creating an account you agree to our{" "}
        <a className="underline" href="/terms">
          Terms
        </a>{" "}
        and{" "}
        <a className="underline" href="/privacy-policy">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
