"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createContact } from "./actions";

type Contact = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
};

type ViewMode = "table" | "cards";

export function ContactsList({ contacts, canEdit }: { contacts: Contact[]; canEdit: boolean }) {
  const [view, setView] = useState<ViewMode>("table");
  const sortedContacts = useMemo(
    () => [...contacts].sort((a, b) => (a.full_name ?? "").localeCompare(b.full_name ?? "")),
    [contacts]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--muted)]">Contacts view</span>
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

      {canEdit ? (
        <div className="rounded-2xl border border-[color:var(--border)] bg-white p-4 shadow-sm shadow-[rgba(17,64,111,0.05)]">
          <p className="text-sm font-semibold text-[color:var(--ink)]">Add contact</p>
          <form action={createContact} className="mt-3 grid gap-3 sm:grid-cols-3">
            <input
              name="full_name"
              placeholder="Full name"
              required
              className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-mid)]/50 px-3 py-2 text-sm text-[color:var(--ink)] focus:border-[color:var(--accent)] focus:outline-none"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-mid)]/50 px-3 py-2 text-sm text-[color:var(--ink)] focus:border-[color:var(--accent)] focus:outline-none"
            />
            <input
              name="phone"
              placeholder="Phone"
              className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-mid)]/50 px-3 py-2 text-sm text-[color:var(--ink)] focus:border-[color:var(--accent)] focus:outline-none"
            />
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="inline-flex items-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow"
              >
                Create contact
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {view === "table" ? (
        <div className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white shadow-sm shadow-[rgba(17,64,111,0.06)]">
          <table className="w-full text-sm">
            <thead className="bg-[color:var(--bg-mid)]/70 text-left text-[color:var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
              </tr>
            </thead>
            <tbody>
              {sortedContacts.map((contact) => (
                <tr key={contact.id} className="border-t border-[color:var(--border)] align-top">
                  <td className="px-4 py-3 font-semibold text-[color:var(--ink)]">
                    {canEdit ? (
                      <Link
                        href={`/account-admin/contacts/${contact.id}`}
                        className="underline-offset-2 hover:underline"
                      >
                        {contact.full_name ?? "Contact"}
                      </Link>
                    ) : (
                      contact.full_name ?? "Contact"
                    )}
                  </td>
                  <td className="px-4 py-3 text-[color:var(--muted)]">{contact.email ?? "—"}</td>
                  <td className="px-4 py-3 text-[color:var(--muted)]">{contact.phone ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sortedContacts.map((contact) => (
            <div
              key={contact.id}
              className="space-y-3 rounded-2xl border border-[color:var(--border)] bg-white p-4 shadow-sm shadow-[rgba(17,64,111,0.05)]"
            >
              <div>
                <h3 className="text-lg font-semibold text-[color:var(--ink)]">
                  {canEdit ? (
                    <Link
                      href={`/account-admin/contacts/${contact.id}`}
                      className="underline-offset-2 hover:underline"
                    >
                      {contact.full_name ?? "Contact"}
                    </Link>
                  ) : (
                    contact.full_name ?? "Contact"
                  )}
                </h3>
                <p className="text-sm text-[color:var(--muted)]">{contact.email ?? "—"}</p>
                {contact.phone ? <p className="text-sm text-[color:var(--muted)]">{contact.phone}</p> : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
