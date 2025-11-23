"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Site = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  status: string | null;
  updated_at: string | null;
};

type ViewMode = "table" | "cards";

export function SitesList({ sites }: { sites: Site[] }) {
  const [view, setView] = useState<ViewMode>("table");
  const sortedSites = useMemo(
    () => [...sites].sort((a, b) => a.name.localeCompare(b.name)),
    [sites]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--muted)]">View</span>
        <div className="inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--bg-mid)]/60 p-1 text-xs font-semibold text-[color:var(--ink)]">
          <button
            type="button"
            onClick={() => setView("table")}
            className={`rounded-full px-3 py-1 transition ${view === "table" ? "bg-white shadow-sm" : ""}`}
          >
            Table
          </button>
          <button
            type="button"
            onClick={() => setView("cards")}
            className={`rounded-full px-3 py-1 transition ${view === "cards" ? "bg-white shadow-sm" : ""}`}
          >
            Cards
          </button>
        </div>
      </div>

      {view === "table" ? (
        <div className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white shadow-sm shadow-[rgba(17,64,111,0.06)]">
          <table className="w-full text-sm">
            <thead className="bg-[color:var(--bg-mid)]/70 text-left text-[color:var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody>
              {sortedSites.map((site) => (
                <tr key={site.id} className="border-t border-[color:var(--border)] align-top">
                  <td className="px-4 py-3 font-semibold text-[color:var(--ink)]">
                    <Link
                      href={`/account-admin/sites/${site.id}`}
                      className="text-[color:var(--ink)] underline-offset-2 hover:underline"
                    >
                      {site.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[color:var(--muted)]">{site.status ?? "—"}</td>
                  <td className="px-4 py-3 text-[color:var(--muted)]">
                    {site.updated_at ? new Date(site.updated_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sortedSites.map((site) => (
            <div
              key={site.id}
              className="space-y-3 rounded-2xl border border-[color:var(--border)] bg-white p-4 shadow-sm shadow-[rgba(17,64,111,0.05)]"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--accent-2)]">
                  {site.status ?? "Draft"}
                </p>
                <h3 className="text-lg font-semibold text-[color:var(--ink)]">
                  <Link
                    href={`/account-admin/sites/${site.id}`}
                    className="text-[color:var(--ink)] underline-offset-2 hover:underline"
                  >
                    {site.name}
                  </Link>
                </h3>
                <p className="text-sm text-[color:var(--muted)]">{site.description || "No description yet."}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
