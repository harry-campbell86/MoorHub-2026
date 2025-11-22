import { ReactNode } from "react";
import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await requireSession("/login");
  const supabase = createClient();
  const memberships = await supabase
    .from("account_memberships")
    .select("id")
    .eq("user_id", session.user.id);

  const hasAccountMembership = (memberships.data?.length ?? 0) > 0;

  const navPrimary = [
    { href: "/dashboard", label: "Profile" },
    { href: "/dashboard/favourites", label: "Favourites" },
    { href: "/dashboard/bookings", label: "Bookings" },
    { href: "/dashboard/settings", label: "Settings" },
  ];

  const navAdmin = hasAccountMembership
    ? [{ href: "/dashboard/mooring-sites", label: "Mooring sites" }]
    : [];
  const email = session.user.email ?? "Account";

  return (
    <main className="min-h-screen bg-[color:var(--bg-mid)]/60 text-[color:var(--ink)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 lg:flex-row">
        <aside className="w-full lg:w-64">
          <div className="sticky top-6 space-y-4 rounded-2xl border border-[color:var(--border)] bg-white p-4 shadow-sm shadow-[rgba(17,64,111,0.06)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--accent-2)]">
                  Dashboard
                </p>
                <p className="text-sm font-semibold">{email}</p>
              </div>
              <MobileMenu navPrimary={navPrimary} navAdmin={navAdmin} />
            </div>
            <nav className="hidden flex-col gap-4 lg:flex">
              <div className="flex flex-col gap-1">
                {navPrimary.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-xl px-3 py-2 text-sm font-semibold text-[color:var(--ink)] transition hover:bg-[color:var(--bg-mid)]/60"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              {navAdmin.length ? (
                <div className="space-y-1">
                  <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">
                    Admin
                  </p>
                  {navAdmin.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-xl px-3 py-2 text-sm font-semibold text-[color:var(--ink)] transition hover:bg-[color:var(--bg-mid)]/60"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </nav>
          </div>
        </aside>
        <section className="flex-1">
          <div className="rounded-3xl border border-[color:var(--border)] bg-white p-6 shadow-sm shadow-[rgba(17,64,111,0.06)]">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}

function MobileMenu({
  navPrimary,
  navAdmin,
}: {
  navPrimary: { href: string; label: string }[];
  navAdmin: { href: string; label: string }[];
}) {
  return (
    <details className="lg:hidden">
      <summary className="cursor-pointer rounded-full bg-[color:var(--bg-mid)] px-3 py-1 text-xs font-semibold text-[color:var(--ink)] ring-1 ring-[color:var(--border)]">
        Menu
      </summary>
      <div className="mt-2 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          {navPrimary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-[color:var(--ink)] transition hover:bg-[color:var(--bg-mid)]/60"
            >
              {item.label}
            </Link>
          ))}
        </div>
        {navAdmin.length ? (
          <div className="flex flex-col gap-1">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">
              Admin
            </p>
            {navAdmin.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-[color:var(--ink)] transition hover:bg-[color:var(--bg-mid)]/60"
              >
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </details>
  );
}
