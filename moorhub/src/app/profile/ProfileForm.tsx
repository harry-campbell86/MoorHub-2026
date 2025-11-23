"use client";

import { useFormState } from "react-dom";
import { updateProfile } from "./actions";

type ProfileFormProps = {
  defaultName: string;
  defaultEmail: string;
  defaultPhone: string;
  accountName?: string | null;
  isContact: boolean;
};

const initialState = { error: undefined as string | undefined, success: undefined as string | undefined };

export function ProfileForm({
  defaultName,
  defaultEmail,
  defaultPhone,
  accountName,
  isContact,
}: ProfileFormProps) {
  const [state, formAction] = useFormState(updateProfile, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-sm shadow-[rgba(17,64,111,0.05)]">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-[color:var(--ink)]">
          <span>Name</span>
          <input
            name="name"
            defaultValue={defaultName}
            required
            className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-mid)]/50 px-3 py-2 text-sm text-[color:var(--ink)] focus:border-[color:var(--accent)] focus:outline-none"
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-[color:var(--ink)]">
          <span>Email</span>
          <input
            type="email"
            name="email"
            defaultValue={defaultEmail}
            required
            className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-mid)]/50 px-3 py-2 text-sm text-[color:var(--ink)] focus:border-[color:var(--accent)] focus:outline-none"
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-[color:var(--ink)]">
          <span>Phone</span>
          <input
            type="tel"
            name="phone"
            defaultValue={defaultPhone}
            className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-mid)]/50 px-3 py-2 text-sm text-[color:var(--ink)] focus:border-[color:var(--accent)] focus:outline-none"
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-[color:var(--ink)]">
          <span>New password (optional)</span>
          <input
            type="password"
            name="password"
            placeholder="Leave blank to keep current password"
            className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-mid)]/50 px-3 py-2 text-sm text-[color:var(--ink)] focus:border-[color:var(--accent)] focus:outline-none"
          />
        </label>
      </div>

      {isContact ? (
        <div className="rounded-lg bg-[color:var(--bg-mid)]/50 px-3 py-2 text-sm text-[color:var(--muted)]">
          <span className="font-semibold text-[color:var(--ink)]">My company:</span>{" "}
          {accountName || "Unknown company"}
        </div>
      ) : null}

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-green-600">{state.success}</p> : null}

      <button
        type="submit"
        className="inline-flex items-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-[rgba(5,167,159,0.3)] transition hover:-translate-y-0.5 hover:shadow"
      >
        Save changes
      </button>
    </form>
  );
}
