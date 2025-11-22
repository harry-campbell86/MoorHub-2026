import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FavoriteToggle } from "@/app/components/FavoriteToggle";

type Site = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  status: string | null;
  slug: string;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const supabase = createClient();
  const userRes = await supabase.auth.getUser();
  const user = userRes.data.user;
  const q = (searchParams.q ?? "").trim();

  const query = supabase
    .from("mooring_sites")
    .select("id, name, description, address, status, slug")
    .eq("status", "published")
    .order("name");

  if (q) {
    query.ilike("name", `%${q}%`);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  const sites: Site[] =
    data?.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      address: row.address,
      status: row.status,
      slug: row.slug,
    })) ?? [];

  const favoriteIds = new Set<string>();
  if (user) {
    const favRes = await supabase.from("favorites").select("mooring_site_id").eq("user_id", user.id);
    if (!favRes.error) {
      favRes.data?.forEach((f) => favoriteIds.add(f.mooring_site_id));
    }
  }

  return (
    <main className="min-h-screen bg-[color:var(--bg-mid)]/60 px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent-2)]">
            Mooring search
          </p>
          <h1 className="text-3xl font-semibold text-[color:var(--ink)]">
            Find long-stay moorings
          </h1>
          <p className="text-sm text-[color:var(--muted)]">
            Browse public listings. Select a site to view details. No login required to view published sites.
          </p>
        </div>

        <form className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by name"
            className="w-full rounded-2xl border border-[color:var(--border)] px-4 py-3 text-[color:var(--ink)] shadow-inner shadow-[rgba(17,64,111,0.04)] focus:border-[color:var(--accent)] focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-[rgba(5,167,159,0.3)] transition hover:-translate-y-0.5 hover:shadow sm:w-auto"
          >
            Search
          </button>
        </form>

        {sites.length === 0 ? (
          <div className="rounded-2xl border border-[color:var(--border)] bg-white p-4 text-sm text-[color:var(--muted)] shadow-sm shadow-[rgba(17,64,111,0.06)]">
            No mooring sites found. Try another search.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sites.map((site) => (
              <div
                key={site.id}
                className="rounded-2xl border border-[color:var(--border)] bg-white p-4 shadow-sm shadow-[rgba(17,64,111,0.06)] transition hover:-translate-y-0.5 hover:shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--accent-2)]">Mooring</p>
                    <Link
                      href={`/moorings/${site.slug ?? site.id}`}
                      className="text-lg font-semibold text-[color:var(--ink)] hover:text-[color:var(--accent)]"
                    >
                      {site.name}
                    </Link>
                    {site.address ? (
                      <p className="text-xs text-[color:var(--muted)]">{site.address}</p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <FavoriteToggle
                      siteId={site.id}
                      redirectTo={`/search${q ? `?q=${encodeURIComponent(q)}` : ""}`}
                      isFavorite={favoriteIds.has(site.id)}
                    />
                    <span className="rounded-full bg-[color:var(--bg-mid)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--muted)] ring-1 ring-[color:var(--border)]">
                      {site.status}
                    </span>
                  </div>
                </div>
                {site.description ? (
                  <p className="mt-2 line-clamp-3 text-sm text-[color:var(--muted)]">{site.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
