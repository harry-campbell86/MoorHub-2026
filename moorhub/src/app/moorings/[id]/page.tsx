import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FavoriteToggle } from "@/app/components/FavoriteToggle";

type MooringSiteRow = {
  id: string;
  slug: string | null;
  name: string;
  description: string | null;
  address: string | null;
  status: string | null;
};

export default async function MooringDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const slugParam = decodeURIComponent(params.id);

  const baseSelect = supabase.from("mooring_sites").select("id, slug, name, description, address, status");

  let data = (
    await baseSelect.eq("slug", slugParam).maybeSingle()
  ).data as MooringSiteRow | null;

  if (!data) {
    data = (await baseSelect.eq("id", slugParam).maybeSingle()).data as MooringSiteRow | null;
  }

  if (!data) {
    data = (await baseSelect.ilike("slug", slugParam).maybeSingle()).data as MooringSiteRow | null;
  }

  if (!data) {
    notFound();
  }

  const accountName = "Mooring";
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  let isFavorite = false;
  if (user) {
    const favRes = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("mooring_site_id", data.id)
      .maybeSingle();
    isFavorite = Boolean(favRes.data);
  }

  return (
    <main className="min-h-screen bg-[color:var(--bg-mid)]/60 px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-[color:var(--border)] bg-white p-6 shadow-sm shadow-[rgba(17,64,111,0.06)]">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent-2)]">{accountName}</p>
              <h1 className="text-3xl font-semibold text-[color:var(--ink)]">{data.name}</h1>
              <p className="text-sm text-[color:var(--muted)] capitalize">{data.status ?? "draft"}</p>
            </div>
            <FavoriteToggle
              siteId={data.id}
              redirectTo={`/moorings/${slugParam}`}
              isFavorite={isFavorite}
            />
          </div>
        </div>
        {data.address ? (
          <p className="text-sm font-semibold text-[color:var(--ink)]">{data.address}</p>
        ) : null}
        {data.description ? (
          <p className="text-base leading-relaxed text-[color:var(--muted)]">{data.description}</p>
        ) : (
          <p className="text-sm text-[color:var(--muted)]">No description provided.</p>
        )}
        <div className="pt-2">
          <Link
            href="/search"
            className="inline-flex items-center rounded-full bg-[color:var(--bg-mid)] px-4 py-2 text-sm font-semibold text-[color:var(--ink)] ring-1 ring-[color:var(--border)] transition hover:-translate-y-0.5 hover:shadow"
          >
            ← Back to search
          </Link>
        </div>
      </div>
    </main>
  );
}
