"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Site = {
  id: string;
  slug: string | null;
  name: string;
  description: string | null;
  address: string | null;
  status: string | null;
  accountName: string;
  updated_at: string | null;
};

type ViewMode = "table" | "cards";

export function MooringSitesList({ sites }: { sites: Site[] }) {
  const [view, setView] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "table";
    const saved = window.localStorage.getItem("mooring-sites-view");
    return saved === "cards" || saved === "table" ? saved : "table";
  });

  const sortedSites = useMemo(
    () => [...sites].sort((a, b) => a.name.localeCompare(b.name)),
    [sites]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">
          View
        </span>
        <div className="inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--bg-mid)]/50 p-1 text-xs font-semibold text-[color:var(--ink)]">
          <button
            className={`rounded-full px-3 py-1 transition ${view === "table" ? "bg-white shadow-sm shadow-[rgba(17,64,111,0.08)]" : ""}`}
            onClick={() => {
              setView("table");
              if (typeof window !== "undefined") window.localStorage.setItem("mooring-sites-view", "table");
            }}
            type="button"
          >
            Table
          </button>
          <button
            className={`rounded-full px-3 py-1 transition ${view === "cards" ? "bg-white shadow-sm shadow-[rgba(17,64,111,0.08)]" : ""}`}
            onClick={() => {
              setView("cards");
              if (typeof window !== "undefined") window.localStorage.setItem("mooring-sites-view", "cards");
            }}
            type="button"
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
                <th className="px-4 py-3 font-semibold">Account</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody>
              {sortedSites.map((site) => (
                <tr key={site.id} className="border-t border-[color:var(--border)]">
                  <td className="px-4 py-3">
                    <Link
                      className="font-semibold text-[color:var(--ink)] hover:text-[color:var(--accent)]"
                      href={`/dashboard/mooring-sites/${site.slug ?? site.id}`}
                    >
                      {site.name}
                    </Link>
                    {site.address ? (
                      <p className="text-xs text-[color:var(--muted)]">{site.address}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-[color:var(--muted)]">{site.accountName}</td>
                  <td className="px-4 py-3 text-[color:var(--ink)] capitalize">{site.status ?? "draft"}</td>
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
              className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-mid)]/40 p-4 shadow-sm shadow-[rgba(17,64,111,0.04)]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--accent-2)]">
                    {site.accountName}
                  </p>
                  <Link
                    href={`/dashboard/mooring-sites/${site.slug ?? site.id}`}
                    className="text-lg font-semibold text-[color:var(--ink)] hover:text-[color:var(--accent)]"
                  >
                    {site.name}
                  </Link>
                  {site.address ? (
                    <p className="text-xs text-[color:var(--muted)]">{site.address}</p>
                  ) : null}
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--muted)] ring-1 ring-[color:var(--border)]">
                  {site.status ?? "draft"}
                </span>
              </div>
              {site.description ? (
                <p className="mt-2 text-sm text-[color:var(--muted)] line-clamp-3">{site.description}</p>
              ) : null}
              <div className="mt-3 text-right text-xs text-[color:var(--muted)]">
                {site.updated_at ? `Updated ${new Date(site.updated_at).toLocaleDateString()}` : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
