import Link from "next/link";
import React from "react";

const links = [
  { label: "Home", href: "/" },
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-[color:var(--border)] bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div>
          <p className="text-sm font-semibold text-[color:var(--ink)]">MoorHub</p>
          <p className="text-xs text-[color:var(--muted)]">Wherever floats your boat.</p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-[color:var(--muted)]">
          {links.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full border border-[color:var(--border)] px-3 py-1 transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent-2)]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
