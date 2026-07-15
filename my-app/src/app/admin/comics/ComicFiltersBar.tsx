"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

type ComicFiltersBarProps = {
  initialCategory: string;
  initialStatus: string;
  initialQuery: string;
};

export default function ComicFiltersBar({
  initialCategory,
  initialStatus,
  initialQuery,
}: ComicFiltersBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState(initialCategory);
  const [status, setStatus] = useState(initialStatus);
  const [query, setQuery] = useState(initialQuery);

  const pushParams = useCallback(
    (nextCategory: string, nextStatus: string, nextQuery: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (nextCategory && nextCategory !== "ALL") {
        params.set("category", nextCategory);
      } else {
        params.delete("category");
      }

      if (nextStatus && nextStatus !== "ALL") {
        params.set("status", nextStatus);
      } else {
        params.delete("status");
      }

      const trimmedQuery = nextQuery.trim();
      if (trimmedQuery.length > 0) {
        params.set("q", trimmedQuery);
      } else {
        params.delete("q");
      }

      const paramsString = params.toString();
      router.replace(paramsString ? `${pathname}?${paramsString}` : pathname);
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex w-full flex-1 flex-col gap-3 lg:flex-row lg:items-center">
        <select
          value={category}
          onChange={(event) => {
            const nextCategory = event.target.value;
            setCategory(nextCategory);
            pushParams(nextCategory, status, query);
          }}
          className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
        >
          <option value="ALL">All</option>
          <option value="Manhwa">Manhwa</option>
          <option value="Manga">Manga</option>
          <option value="Manhua">Manhua</option>
          <option value="Webcomics">Webcomics</option>
        </select>

        <select
          value={status}
          onChange={(event) => {
            const nextStatus = event.target.value;
            setStatus(nextStatus);
            pushParams(category, nextStatus, query);
          }}
          className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
        >
          <option value="ALL">Select status</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
          <option value="HIATUS">Hiatus</option>
          <option value="COMING_SOON">Coming_Soon</option>
        </select>
      </div>

      <div className="w-full max-w-lg">
        <input
          type="search"
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            pushParams(category, status, nextQuery);
          }}
          placeholder="Search comic name"
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
        />
      </div>
    </div>
  );
}
