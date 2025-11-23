import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";

export default async function FavouritesPage() {
  const session = await requireSession("/login");
  const supabase = createClient();

  const favsRes = await supabase
    .from("favorites")
    .select("id, mooring_site_id, mooring_sites ( id, slug, name, description, address, status )")
    .eq("user_id", session.user.id)
    .order("id", { ascending: false });

  if (favsRes.error) {
    throw favsRes.error;
  }

  const favs =
    (favsRes.data ?? []).map((row) => {
      const r = row as {
        id: string;
        mooring_sites: {
          id: string;
          slug: string | null;
          name: string | null;
          description: string | null;
          address: string | null;
          status: string | null;
        } | null;
      };
      return { id: r.id, site: r.mooring_sites };
    }) ?? [];

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10 sm:px-10">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent-2)]">My favourites</p>
        <h1 className="text-3xl font-semibold text-[color:var(--ink)]">Saved mooring sites</h1>
        <p className="text-sm text-[color:var(--muted)]">Sites you’ve saved while browsing.</p>
      </div>

      {favs.length === 0 ? (
        <div className="rounded-2xl border border-[color:var(--border)] bg-white p-6 text-sm text-[color:var(--muted)] shadow-sm">
          You have no favourites yet. {" "}
          <Link className="text-[color:var(--accent)] underline-offset-2 hover:underline" href="/search">
            Browse moorings
          </Link>
          .
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {favs.map(({ id, site }) => (
            <div
              key={id}
              className="space-y-2 rounded-2xl border border-[color:var(--border)] bg-white p-4 shadow-sm shadow-[rgba(17,64,111,0.05)]"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-[color:var(--ink)]">{site?.name ?? "Mooring site"}</h3>
                <span className="rounded-full bg-[color:var(--bg-mid)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--muted)]">
                  {site?.status ?? "Draft"}
                </span>
              </div>
              <p className="text-sm text-[color:var(--muted)]">{site?.description ?? "No description available."}</p>
              {site?.address ? <p className="text-sm text-[color:var(--muted)]">📍 {site.address}</p> : null}
              <Link
                href={site?.slug ? `/moorings/${site.slug}` : `/moorings/${site?.id ?? ""}`}
                className="inline-flex items-center text-sm font-semibold text-[color:var(--accent)] underline-offset-2 hover:underline"
              >
                View details
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
