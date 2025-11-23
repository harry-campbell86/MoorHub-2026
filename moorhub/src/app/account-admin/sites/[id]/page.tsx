import { notFound } from "next/navigation";
import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { deleteMooringSite, updateMooringSite } from "../../actions";

export default async function EditSitePage({ params }: { params: { id: string } }) {
  const session = await requireSession("/login");
  const supabase = createClient();

  const profileRes = await supabase
    .from("profiles")
    .select("account_id")
    .eq("id", session.user.id)
    .maybeSingle();
  if (profileRes.error) throw profileRes.error;
  const accountId = (profileRes.data as { account_id: string | null } | null)?.account_id ?? null;
  if (!accountId) notFound();

  const siteRes = await supabase
    .from("mooring_sites")
    .select("id, name, description, address, status")
    .eq("id", params.id)
    .eq("account_id", accountId)
    .maybeSingle();

  if (siteRes.error) throw siteRes.error;
  const site = siteRes.data as { id: string; name: string; description: string | null; address: string | null; status: string | null } | null;
  if (!site) notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent-2)]">Edit mooring site</p>
          <h2 className="text-2xl font-semibold text-[color:var(--ink)]">{site.name}</h2>
        </div>
        <Link
          href="/account-admin/sites"
          className="text-sm font-semibold text-[color:var(--accent)] underline-offset-2 hover:underline"
        >
          Back to sites
        </Link>
      </div>

      <form action={updateMooringSite} className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-sm">
        <input type="hidden" name="site_id" value={site.id} />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[color:var(--ink)]">
            Name
            <input
              name="name"
              defaultValue={site.name}
              required
              className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-mid)]/50 px-3 py-2 text-sm text-[color:var(--ink)] focus:border-[color:var(--accent)] focus:outline-none"
            />
          </label>
          <label className="text-sm font-semibold text-[color:var(--ink)]">
            Status
            <select
              name="status"
              defaultValue={site.status ?? "draft"}
              className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-mid)]/50 px-3 py-2 text-sm text-[color:var(--ink)] focus:border-[color:var(--accent)] focus:outline-none"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>
        <label className="text-sm font-semibold text-[color:var(--ink)]">
          Address
          <input
            name="address"
            defaultValue={site.address ?? ""}
            className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-mid)]/50 px-3 py-2 text-sm text-[color:var(--ink)] focus:border-[color:var(--accent)] focus:outline-none"
          />
        </label>
        <label className="text-sm font-semibold text-[color:var(--ink)]">
          Description
          <textarea
            name="description"
            defaultValue={site.description ?? ""}
            rows={4}
            className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-mid)]/50 px-3 py-2 text-sm text-[color:var(--ink)] focus:border-[color:var(--accent)] focus:outline-none"
          />
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            className="inline-flex items-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            Save changes
          </button>
          <button
            type="submit"
            formAction={deleteMooringSite}
            className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
