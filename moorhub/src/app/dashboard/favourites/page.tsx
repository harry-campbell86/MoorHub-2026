import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function FavouritesPage() {
  const session = await requireSession("/login");
  const supabase = createClient();

  const favRes = await supabase
    .from("favorites")
    .select("mooring_site_id, mooring_sites(id, slug, name, address, status)")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (favRes.error) {
    throw favRes.error;
  }

  const favourites = (favRes.data ?? [])
    .map((row) => ({
      id: row.mooring_sites?.id,
      slug: row.mooring_sites?.slug,
      name: row.mooring_sites?.name,
      address: row.mooring_sites?.address,
      status: row.mooring_sites?.status,
    }))
    .filter((x) => x.id);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent-2)]">Favourites</p>
        <h1 className="text-2xl font-semibold text-[color:var(--ink)]">Your favourites</h1>
        <p className="text-sm text-[color:var(--muted)]">Saved mooring sites for quick access.</p>
      </div>
      {favourites.length === 0 ? (
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-mid)]/60 p-4 text-sm text-[color:var(--muted)]">
          You have no favourites yet. Browse moorings and click the star to save them.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {favourites.map((fav) => (
            <Link
              key={fav.id}
              href={`/moorings/${fav.slug ?? fav.id}`}
              className="flex flex-col gap-1 rounded-2xl border border-[color:var(--border)] bg-white p-4 shadow-sm shadow-[rgba(17,64,111,0.06)] transition hover:-translate-y-0.5 hover:shadow"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--accent-2)]">Mooring</p>
              <span className="text-lg font-semibold text-[color:var(--ink)]">{fav.name}</span>
              {fav.address ? <span className="text-xs text-[color:var(--muted)]">{fav.address}</span> : null}
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--muted)]">{fav.status}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
