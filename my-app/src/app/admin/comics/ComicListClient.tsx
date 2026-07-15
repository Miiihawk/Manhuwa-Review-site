"use client";

import Image from "next/image";
import Link from "next/link";
import { Edit3, Eye } from "lucide-react";
import { useMemo, useState } from "react";
import DeleteComicButton from "./DeleteComicButton";
import type { AdminComicRow } from "./comic-types";

type ComicListClientProps = {
  comics: AdminComicRow[];
  initialQuery: string;
  initialCategory: string;
  initialStatus: string;
};

export default function ComicListClient({
  comics,
  initialQuery,
  initialCategory,
  initialStatus,
}: ComicListClientProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [status, setStatus] = useState(initialStatus);

  const filteredComics = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return comics.filter((comic) => {
      const matchesCategory = category === "ALL" || comic.type === category;
      const matchesStatus = status === "ALL" || comic.status === status;
      const matchesSearch =
        normalizedQuery.length === 0 || comic.title.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [category, comics, query, status]);

  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#11012e]/70">
      <div className="border-b border-white/10 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full flex-1 flex-col gap-3 lg:flex-row lg:items-center">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full max-w-[12rem] rounded-2xl border border-white/10 bg-black/40 px-3 py-2.5 text-xs text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
            >
              <option value="ALL">All</option>
              <option value="Manhwa">Manhwa</option>
              <option value="Manga">Manga</option>
              <option value="Manhua">Manhua</option>
              <option value="Webcomics">Webcomics</option>
            </select>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full max-w-[12rem] rounded-2xl border border-white/10 bg-black/40 px-3 py-2.5 text-xs text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
            >
              <option value="ALL">Select status</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="HIATUS">Hiatus</option>
              <option value="COMING_SOON">Coming_Soon</option>
            </select>
          </div>

          <div className="flex w-full max-w-lg items-center gap-3 lg:justify-end">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search comic name"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-white outline-none transition placeholder:text-white/35 focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
            />
          </div>
        </div>
      </div>

      {filteredComics.length > 0 ? (
        <div className="divide-y divide-white/10">
          {filteredComics.map((comic) => (
            <article
              key={comic.id}
              className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[120px_1fr_auto] lg:items-center"
            >
              <div className="relative h-44 overflow-hidden rounded-2xl border border-white/10 bg-black sm:h-36">
                <Image
                  src={comic.image}
                  alt={comic.title}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#ff018f]/20 bg-[#ff018f]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[#f6a1ff]">
                    {comic.status}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[#d9ccff]">
                    {comic.type}
                  </span>
                  <span className="text-xs font-medium text-white/45">
                    Updated {comic.updatedAt}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white">{comic.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/66 line-clamp-2">
                    {comic.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 lg:justify-end">
                <Link
                  href={`/${comic.slug}`}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-[#fff7e0]/20 bg-[#fff7e0]/10 px-4 text-sm font-semibold text-white transition-colors hover:border-[#fff7e0]/40 hover:bg-[#fff7e0]/15"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Link>
                <Link
                  href={`/admin/comics/${comic.id}/edit`}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-[#f6a1ff]/25 bg-white/5 px-4 text-sm font-semibold text-white transition-colors hover:border-[#ff018f]/50 hover:bg-white/10"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Link>
                <DeleteComicButton id={comic.id} title={comic.title} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="px-6 py-10 text-center">
          <p className="text-sm font-semibold text-white/75">No Comic Found</p>
          <p className="mt-2 text-sm text-white/40">
            Try a different comic name, category, or status.
          </p>
        </div>
      )}
    </div>
  );
}
