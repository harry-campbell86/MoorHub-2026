"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleFavoriteDirect } from "@/app/favourites/actions";

export function FavoriteToggle({
  siteId,
  redirectTo,
  isFavorite,
}: {
  siteId: string;
  redirectTo: string;
  isFavorite: boolean;
}) {
  const [current, setCurrent] = useState(isFavorite);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    setCurrent((prev) => !prev);
    startTransition(async () => {
      await toggleFavoriteDirect(siteId, redirectTo);
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      aria-pressed={current}
      aria-label={current ? "Remove from favourites" : "Add to favourites"}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] bg-white text-lg transition hover:-translate-y-0.5 hover:shadow ${
        current ? "text-yellow-500" : "text-[color:var(--muted)]"
      }`}
      disabled={pending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleClick();
      }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={`h-5 w-5 ${current ? "fill-current" : "fill-none"} stroke-current`}
        strokeWidth="1.6"
      >
        <path d="M12 17.3 6.2 21l1.6-6.6L2 8.9l6.7-.6L12 2l3.3 6.3 6.7.6-5.8 5.5L17.8 21z" />
      </svg>
    </button>
  );
}
