"use client";

import { useMemo, useState } from "react";
import CategoryRow from "./CategoryRow";

export default function CategoryList({
  categories,
}: {
  categories: { id: number; name: string; count: number }[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, searchQuery]);

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#11012e]/70">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-2xl font-black text-white">All categories</h2>
        </div>
        <div className="w-full max-w-sm">
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search categories"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
          />
        </div>
      </div>

      {categories.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-white/40">
          No categories yet — add your first one on the right.
        </p>
      ) : filtered.length > 0 ? (
        <div className="divide-y divide-white/10">
          {filtered.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <p className="px-6 py-10 text-center text-sm text-white/40">
          No categories match “{searchQuery}”.
        </p>
      )}
    </div>
  );
}
