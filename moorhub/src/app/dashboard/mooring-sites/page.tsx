import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { MooringSitesList } from "./MooringSitesList";

type MooringSite = {
  id: string;
  slug: string | null;
  name: string;
  description: string | null;
  address: string | null;
  status: string | null;
  account_id: string;
  updated_at: string | null;
};

export default async function MooringSitesPage() {
  const session = await requireSession("/login");
  const supabase = createClient();

  const membershipsRes = await supabase
    .from("account_memberships")
    .select("account_id")
    .eq("user_id", session.user.id);

  if (membershipsRes.error) {
    throw membershipsRes.error;
  }

  const accountIds = (membershipsRes.data ?? []).map((m) => m.account_id);

  if (!accountIds.length) {
    return (
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent-2)]">Mooring sites</p>
        <h1 className="text-2xl font-semibold text-[color:var(--ink)]">No account access</h1>
        <p className="text-sm text-[color:var(--muted)]">
          You are not linked to an account yet. Ask an account admin to invite you so you can manage mooring
          sites.
        </p>
      </div>
    );
  }

  const accountsRes = await supabase.from("accounts").select("id, name").in("id", accountIds);
  if (accountsRes.error) {
    throw accountsRes.error;
  }
  const accountNameMap = new Map(accountsRes.data?.map((a) => [a.id, a.name]) ?? []);

  const sitesRes = await supabase
    .from("mooring_sites")
    .select("id, slug, name, description, address, status, account_id, updated_at")
    .in("account_id", accountIds)
    .order("name", { ascending: true });

  if (sitesRes.error) {
    throw sitesRes.error;
  }

  const sites = (sitesRes.data ?? []).map((site) => ({
    ...site,
    accountName: accountNameMap.get(site.account_id) ?? "Account",
  }));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent-2)]">Mooring sites</p>
        <h1 className="text-2xl font-semibold text-[color:var(--ink)]">Manage your mooring sites</h1>
        <p className="text-sm text-[color:var(--muted)]">
          Update names, descriptions, and statuses for the mooring sites tied to your accounts. Published sites are
          visible to everyone; drafts stay private to account members.
        </p>
      </div>
      {sites.length === 0 ? (
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-mid)]/60 p-4 text-sm text-[color:var(--muted)]">
          No mooring sites yet. Create one from your account workspace.
        </div>
      ) : (
        <MooringSitesList sites={sites} />
      )}
    </div>
  );
}
