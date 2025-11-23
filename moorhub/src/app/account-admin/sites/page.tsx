import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { SitesList } from "../SitesList";

export const dynamic = "force-dynamic";

export default async function SitesPage() {
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

  const sitesRes = await supabase
    .from("mooring_sites")
    .select("id, name, description, address, status, updated_at")
    .eq("account_id", accountId)
    .order("name", { ascending: true });
  if (sitesRes.error) throw sitesRes.error;
  const sites = (sitesRes.data ?? []) as Array<{
    id: string;
    name: string;
    description: string | null;
    address: string | null;
    status: string | null;
    updated_at: string | null;
  }>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[color:var(--ink)]">Mooring sites</h2>
          <p className="text-sm text-[color:var(--muted)]">Manage mooring sites for this account.</p>
        </div>
        <Link
          href="/account-admin/sites/new"
          className="inline-flex items-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-[rgba(5,167,159,0.3)] transition hover:-translate-y-0.5 hover:shadow"
        >
          New
        </Link>
      </div>
      <SitesList sites={sites} />
    </div>
  );
}
