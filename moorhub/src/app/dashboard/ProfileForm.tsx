"use client";

import { useFormState } from "react-dom";
import { updateProfile } from "./actions";

const initialState = { error: undefined as string | undefined, success: undefined as string | undefined };

export function ProfileForm({ email, name }: { email: string; name?: string }) {
  const [state, formAction] = useFormState(updateProfile, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-mid)]/40 p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2 text-sm text-[color:var(--muted)]">
          <span className="font-semibold text-[color:var(--ink)]">Full name</span>
          <input
            className="w-full rounded-2xl border border-[color:var(--border)] px-4 py-3 text-[color:var(--ink)] shadow-inner shadow-[rgba(17,64,111,0.04)] focus:border-[color:var(--accent)] focus:outline-none"
            type="text"
            name="name"
            placeholder="Your name"
            defaultValue={name ?? ""}
          />
        </label>
        <label className="block space-y-2 text-sm text-[color:var(--muted)]">
          <span className="font-semibold text-[color:var(--ink)]">Email</span>
          <input
            className="w-full rounded-2xl border border-[color:var(--border)] px-4 py-3 text-[color:var(--ink)] shadow-inner shadow-[rgba(17,64,111,0.04)] focus:border-[color:var(--accent)] focus:outline-none"
            type="email"
            name="email"
            placeholder={email || "you@example.com"}
            defaultValue={email}
          />
        </label>
      </div>
      <label className="block space-y-2 text-sm text-[color:var(--muted)]">
        <span className="font-semibold text-[color:var(--ink)]">Password</span>
        <input
          className="w-full rounded-2xl border border-[color:var(--border)] px-4 py-3 text-[color:var(--ink)] shadow-inner shadow-[rgba(17,64,111,0.04)] focus:border-[color:var(--accent)] focus:outline-none"
          type="password"
          name="password"
          placeholder="New password"
        />
        <span className="text-xs text-[color:var(--muted)]">Leave blank to keep current password.</span>
      </label>
      {state.error ? (
        <p className="text-sm font-semibold text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="text-sm font-semibold text-green-700" role="status">
          {state.success}
        </p>
      ) : null}
      <button
        className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-[rgba(5,167,159,0.3)] transition hover:-translate-y-0.5 hover:shadow"
        type="submit"
      >
        Save changes
      </button>
      <p className="text-xs text-[color:var(--muted)]">
        Email changes require verification. Password updates need at least 6 characters.
      </p>
    </form>
  );
}
