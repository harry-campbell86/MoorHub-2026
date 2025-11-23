"use client";

import { useFormState } from "react-dom";
import { deleteContact, updateContact, type ActionState } from "../../actions";

const initialState: ActionState = {};

export default function ContactEditForm({
  contact,
}: {
  contact: { id: string; full_name: string | null; email: string | null; phone: string | null };
}) {
  const [state, formAction] = useFormState(updateContact, initialState);

  return (
    <div className="space-y-3 rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-sm">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="contact_id" value={contact.id} />
        <label className="text-sm font-semibold text-[color:var(--ink)]">
          Name
          <input
            name="full_name"
            defaultValue={contact.full_name ?? ""}
            required
            className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-mid)]/50 px-3 py-2 text-sm text-[color:var(--ink)] focus:border-[color:var(--accent)] focus:outline-none"
          />
        </label>
        <label className="text-sm font-semibold text-[color:var(--ink)]">
          Email
          <input
            name="email"
            type="email"
            defaultValue={contact.email ?? ""}
            required
            className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-mid)]/50 px-3 py-2 text-sm text-[color:var(--ink)] focus:border-[color:var(--accent)] focus:outline-none"
          />
        </label>
        <label className="text-sm font-semibold text-[color:var(--ink)]">
          Phone
          <input
            name="phone"
            defaultValue={contact.phone ?? ""}
            className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-mid)]/50 px-3 py-2 text-sm text-[color:var(--ink)] focus:border-[color:var(--accent)] focus:outline-none"
          />
        </label>
        {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
        {state.success ? <p className="text-sm text-green-600">{state.success}</p> : null}
        <div className="flex gap-2">
          <button
            type="submit"
            className="inline-flex items-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            Save changes
          </button>
          <button
            type="submit"
            formAction={deleteContact}
            className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
