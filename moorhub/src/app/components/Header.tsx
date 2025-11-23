"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 160"
      role="img"
      aria-label="MoorHub"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M60 4c-24 26-42 53-42 78 0 22 18 40 42 40s42-18 42-40c0-25-18-52-42-78z"
        fill="var(--accent)"
      />
      <path d="M58 28v64H36z" fill="var(--surface)" />
      <path d="M64 28v64h22c2 0 3-2 3-4 0-19-14-45-25-60z" fill="var(--surface)" />
      <path d="M26 96h68c-7 13-22 22-34 22-16 0-26-12-34-22z" fill="var(--accent-2)" />
      <path d="M26 111c8-2 16 0 25 4 12 5 25 11 45-3-8 13-22 20-36 20-18 0-26-10-34-15z" fill="var(--accent-2)" />
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [role, setRole] = React.useState<"loggedOut" | "consumer" | "contact" | "admin">("loggedOut");
  const menuRef = React.useRef<HTMLDivElement>(null);

  const handleLogout = React.useCallback(async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      setRole("loggedOut");
      window.location.href = "/";
    }
  }, []);

  React.useEffect(() => {
    // Close the menu after navigation so it does not stay open on the new page.
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    const supabase = createClient();

    const hydrateViaApi = async () => {
      try {
        const res = await fetch("/api/auth/user", { cache: "no-store" });
        if (!res.ok) {
          setRole("loggedOut");
          return;
        }
        const data = (await res.json()) as { userId: string | null; userClass: string | null };
        if (!data.userId) {
          setRole("loggedOut");
        } else {
          const mapped =
            data.userClass === "admin"
              ? "admin"
              : data.userClass === "contact"
                ? "contact"
                : "consumer";
          setRole(mapped);
        }
      } catch {
        setRole("loggedOut");
      }
    };

    hydrateViaApi();
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      setOpen(false);
      if (event === "SIGNED_OUT" || event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") {
        hydrateViaApi();
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!open) return;
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => document.removeEventListener("mousedown", handleClickOutside, true);
  }, [open]);

  const isAuthed = role !== "loggedOut";

  const menuItems = React.useMemo(() => {
    if (role === "loggedOut") {
      return [
        { label: "Log in", href: "/login" },
        { label: "Register", href: "/register" },
      ];
    }

    const profileItem = { label: "My profile", href: "/profile" };
    if (role === "contact" || role === "admin") {
      return [
        profileItem,
        { label: "Account admin", href: "/account-admin/sites" },
      ];
    }

    return [
      profileItem,
      { label: "My favourites", href: "/favourites" },
    ];
  }, [role]);

  return (
    <header className="relative z-20 w-full border-b border-[color:var(--border)] bg-white/90 shadow-sm shadow-[rgba(17,64,111,0.06)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3 sm:px-10">
        <Link href="/" className="flex items-center gap-3">
          <LogoMark className="h-12 w-9" />
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--accent-2)]">MoorHub</p>
            <p className="text-sm text-[color:var(--muted)]">Directory of marinas and long-stay moorings</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen((prev) => !prev)}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-[color:var(--border)] px-3 py-2 text-sm font-medium text-[color:var(--ink)] shadow-sm shadow-[rgba(17,64,111,0.04)]"
            >
              <span className="hidden sm:inline">Menu</span>
              <span className="sm:hidden text-lg" aria-label="Menu">|||</span>
            </button>
            <div
              className={`absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-[color:var(--border)] bg-white shadow-[0_12px_30px_rgba(10,47,100,0.12)] transition ${open ? "opacity-100 visible translate-y-0" : "invisible translate-y-1 opacity-0"} z-30`}
              role="menu"
            >
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm text-[color:var(--ink)] transition hover:bg-[color:var(--bg-mid)] hover:text-[color:var(--accent-2)]"
                  role="menuitem"
                >
                  {item.label}
                </Link>
              ))}
              {isAuthed ? (
                <div className="border-t border-[color:var(--border)]">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-3 text-left text-sm font-semibold text-[color:var(--ink)] transition hover:bg-[color:var(--bg-mid)] hover:text-[color:var(--accent-2)]"
                  >
                    Log out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
