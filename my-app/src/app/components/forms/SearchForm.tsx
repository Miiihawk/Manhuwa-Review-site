"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Result = { slug: string; title: string; coverPhoto: string };

export default function SearchForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced live search as the user types.
  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
        if (!res.ok) return;
        setResults(await res.json());
        setOpen(true);
      } catch (error) {
        console.error("Search failed:", error);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Close the dropdown when clicking outside.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    setOpen(false);
    router.push(q ? `/comicseries?q=${encodeURIComponent(q)}` : "/comicseries");
  }

  function goTo(slug: string) {
    setOpen(false);
    setQuery("");
    router.push(`/${slug}`);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="search">
          Search manhwa
        </label>
        <div className="flex items-center gap-3 rounded-full bg-white/5 px-4 py-3 backdrop-blur-md">
          <span className="text-white/45">⌕</span>
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Search manhwa, genres, or authors"
            autoComplete="off"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
          />
        </div>
      </form>

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-2xl border border-white/10 bg-[#120529]/95 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          <ul className="max-h-80 overflow-y-auto py-1">
            {results.map((r) => (
              <li key={r.slug}>
                <button
                  type="button"
                  onClick={() => goTo(r.slug)}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-white/10"
                >
                  <span className="relative h-12 w-9 shrink-0 overflow-hidden rounded-md bg-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.coverPhoto}
                      alt={r.title}
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <span className="text-sm font-semibold text-white/90">
                    {r.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
