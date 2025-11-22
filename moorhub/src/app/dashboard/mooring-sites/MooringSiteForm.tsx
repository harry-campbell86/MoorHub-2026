"use client";

import { useFormState } from "react-dom";
import { updateMooringSite } from "./actions";

type Site = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  status: string | null;
  slug?: string | null;
};

const initialState = { error: undefined as string | undefined, success: undefined as string | undefined };

export function MooringSiteForm({ site }: { site: Site }) {
  const [state, formAction] = useFormState(updateMooringSite, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-mid)]/40 p-4">
      <input type="hidden" name="site_id" value={site.id} />
      <label className="block space-y-2 text-sm text-[color:var(--muted)]">
        <span className="font-semibold text-[color:var(--ink)]">Name</span>
        <input
          className="w-full rounded-xl border border-[color:var(--border)] px-3 py-2 text-[color:var(--ink)] focus:border-[color:var(--accent)] focus:outline-none"
          type="text"
          name="name"
          defaultValue={site.name}
          required
        />
      </label>
      <label className="block space-y-2 text-sm text-[color:var(--muted)]">
        <span className="font-semibold text-[color:var(--ink)]">Description</span>
        <textarea
          className="w-full rounded-xl border border-[color:var(--border)] px-3 py-2 text-[color:var(--ink)] focus:border-[color:var(--accent)] focus:outline-none"
          name="description"
          rows={3}
          defaultValue={site.description ?? ""}
        />
      </label>
      <label className="block space-y-2 text-sm text-[color:var(--muted)]">
        <span className="font-semibold text-[color:var(--ink)]">Address</span>
        <input
          className="w-full rounded-xl border border-[color:var(--border)] px-3 py-2 text-[color:var(--ink)] focus:border-[color:var(--accent)] focus:outline-none"
          type="text"
          name="address"
          defaultValue={site.address ?? ""}
        />
      </label>
      <label className="block space-y-2 text-sm text-[color:var(--muted)]">
        <span className="font-semibold text-[color:var(--ink)]">Status</span>
        <select
          className="w-full rounded-xl border border-[color:var(--border)] px-3 py-2 text-[color:var(--ink)] focus:border-[color:var(--accent)] focus:outline-none"
          name="status"
          defaultValue={site.status ?? "draft"}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </label>
      <label className="block space-y-2 text-sm text-[color:var(--muted)]">
        <span className="font-semibold text-[color:var(--ink)]">Slug (public URL)</span>
        <input
          className="w-full rounded-xl border border-[color:var(--border)] px-3 py-2 text-[color:var(--ink)] focus:border-[color:var(--accent)] focus:outline-none"
          type="text"
          name="slug"
          defaultValue={site.slug ?? ""}
          placeholder="e.g. bluewater-marina-west-dock"
        />
        <span className="text-xs text-[color:var(--muted)]">Leave blank to auto-generate.</span>
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
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-[rgba(5,167,159,0.3)] transition hover:-translate-y-0.5 hover:shadow"
      >
        Save changes
      </button>
    </form>
  );
}
