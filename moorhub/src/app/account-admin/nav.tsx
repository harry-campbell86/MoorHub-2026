"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/account-admin/sites", label: "Mooring sites" },
  { href: "/account-admin/berths", label: "Berths" },
  { href: "/account-admin/bookings", label: "Bookings" },
  { href: "/account-admin/contacts", label: "Contacts" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <div className="flex flex-wrap gap-2 rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 shadow-sm shadow-[rgba(17,64,111,0.05)]">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
              active
                ? "bg-[color:var(--accent)] text-white shadow-sm"
                : "text-[color:var(--ink)] hover:bg-[color:var(--bg-mid)]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
