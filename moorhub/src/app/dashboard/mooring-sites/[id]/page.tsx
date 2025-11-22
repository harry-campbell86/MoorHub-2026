import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { MooringSiteForm } from "../MooringSiteForm";

export default async function MooringSiteDetailPage({ params }: { params: { id: string } }) {
  const session = await requireSession("/login");
  const supabase = createClient();
  const slugParam = decodeURIComponent(params.id);

  const baseSelect = supabase
    .from("mooring_sites")
    .select("id, slug, name, description, address, status, account_id, updated_at");

  let site =
    (await baseSelect.eq("slug", slugParam).maybeSingle()).data ||
    (await baseSelect.eq("id", slugParam).maybeSingle()).data ||
    (await baseSelect.ilike("slug", slugParam).maybeSingle()).data;

  if (!site) {
    notFound();
  }

  const membershipRes = await supabase
    .from("account_memberships")
    .select("id")
    .eq("user_id", session.user.id)
    .eq("account_id", site.account_id);

  if (membershipRes.error) {
    throw membershipRes.error;
  }

  const hasMembership = (membershipRes.data?.length ?? 0) > 0;
  if (!hasMembership) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent-2)]">Mooring site</p>
        <h1 className="text-2xl font-semibold text-[color:var(--ink)]">{site.name}</h1>
        <p className="text-sm text-[color:var(--muted)]">Update the details and status for this site.</p>
      </div>
      {hasMembership ? (
        <MooringSiteForm site={site} />
      ) : (
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-mid)]/60 p-4 text-sm text-[color:var(--muted)]">
          You do not have permission to edit this mooring site.
        </div>
      )}
    </div>
  );
}
