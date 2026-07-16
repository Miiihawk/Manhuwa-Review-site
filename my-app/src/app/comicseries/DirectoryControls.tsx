"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

type Option = { value: string; label: string };

const SORTS: Option[] = [
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviewed" },
  { value: "recent", label: "Recently Added" },
  { value: "title", label: "Title A–Z" },
];

const STATUSES: Option[] = [
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "HIATUS", label: "Hiatus" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "DROPPED", label: "Dropped" },
  { value: "MASS_RELEASED", label: "Mass Released" },
  { value: "COMING_SOON", label: "Coming Soon" },
];

export default function DirectoryControls({
  categories,
  genres,
}: {
  categories: Option[];
  genres: Option[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const sort = searchParams.get("sort") ?? "rating";
  const status = searchParams.get("status") ?? "";
  const type = searchParams.get("type") ?? "";
  const genre = searchParams.get("genre") ?? "";

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  const activeCount = [status, type, genre].filter(Boolean).length;

  return (
    <div className="flex flex-col items-stretch sm:items-end gap-3 w-full sm:w-auto">
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <div className="flex items-center gap-2 h-9 px-4 rounded-lg bg-white/5 border border-white/5">
          <ArrowUpDown className="h-3.5 w-3.5 text-pink-500" />
          <select
            value={sort}
            onChange={(e) => setParam("sort", e.target.value)}
            className="bg-transparent text-xs font-bold text-white/80 outline-none cursor-pointer [&>option]:bg-[#120529]"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center gap-2 h-9 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white/80 border border-white/5 transition active:scale-95"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          {activeCount > 0 && (
            <span className="ml-1 rounded-full bg-pink-500 text-white text-[10px] px-1.5 py-0.5">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="w-full sm:w-[440px] rounded-xl border border-white/10 bg-[#120529]/90 backdrop-blur-md p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FilterSelect
            label="Status"
            value={status}
            options={STATUSES}
            onChange={(v) => setParam("status", v)}
          />
          <FilterSelect
            label="Type"
            value={type}
            options={categories}
            onChange={(v) => setParam("type", v)}
          />
          <FilterSelect
            label="Genre"
            value={genre}
            options={genres}
            onChange={(v) => setParam("genre", v)}
          />
          {activeCount > 0 && (
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete("status");
                params.delete("type");
                params.delete("genre");
                const qs = params.toString();
                router.push(qs ? `${pathname}?${qs}` : pathname);
              }}
              className="col-span-full text-left text-[11px] text-white/40 hover:text-pink-400 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] uppercase font-bold tracking-wider text-white/35">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-lg bg-black/40 border border-white/10 px-2 text-xs text-white/90 outline-none [&>option]:bg-[#120529]"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
