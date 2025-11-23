import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { createMooringSite } from "../../actions";

export default async function NewSitePage() {
  const session = await requireSession("/login");
  const supabase = createClient();

  const profileRes = await supabase
    .from("profiles")
    .select("account_id")
    .eq("id", session.user.id)
    .maybeSingle();
  if (profileRes.error) throw profileRes.error;
  const accountId = (profileRes.data as { account_id: string | null } | null)?.account_id ?? null;

  if (!accountId) {
    return (
      <div className="space-y-3 rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[color:var(--ink)]">No account access</h2>
        <p className="text-sm text-[color:var(--muted)]">Your profile is not linked to an account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[color:var(--ink)]">Create mooring site</h2>
          <p className="text-sm text-[color:var(--muted)]">Add a new mooring site for this account.</p>
        </div>
      </div>
      <form action={createMooringSite} className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-sm">
        <input type="hidden" name="account_id" value={accountId} />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[color:var(--ink)]">
            Name
            <input
              name="name"
              required
              className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-mid)]/50 px-3 py-2 text-sm text-[color:var(--ink)] focus:border-[color:var(--accent)] focus:outline-none"
            />
          </label>
          <label className="text-sm font-semibold text-[color:var(--ink)]">
            Status
            <input
              name="status"
              defaultValue="draft"
              className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-mid)]/50 px-3 py-2 text-sm text-[color:var(--ink)] focus:border-[color:var(--accent)] focus:outline-none"
            />
          </label>
        </div>
        <label className="text-sm font-semibold text-[color:var(--ink)]">
          Address
          <input
            name="address"
            className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-mid)]/50 px-3 py-2 text-sm text-[color:var(--ink)] focus:border-[color:var(--accent)] focus:outline-none"
          />
        </label>
        <label className="text-sm font-semibold text-[color:var(--ink)]">
          Description
          <textarea
            name="description"
            rows={4}
            className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-mid)]/50 px-3 py-2 text-sm text-[color:var(--ink)] focus:border-[color:var(--accent)] focus:outline-none"
          />
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            className="inline-flex items-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            Create site
          </button>
        </div>
      </form>
    </div>
  );
}
