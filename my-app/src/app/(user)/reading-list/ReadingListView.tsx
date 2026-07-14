"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Library, ArrowRightLeft } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import type { ListEntry } from "./page";

const STATUS_TABS = [
  { value: "READING", label: "Reading" },
  { value: "PLAN_TO_READ", label: "Plan to Read" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REREADING", label: "Rereading" },
  { value: "PAUSED", label: "Paused" },
  { value: "DROPPED", label: "Dropped" },
];

export default function ReadingListView({ entries }: { entries: ListEntry[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("READING");
  const [removing, setRemoving] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = entries.filter((entry) => entry.status === activeTab);

  async function handleRemove(slug: string) {
    setRemoving(slug);
    try {
      const res = await fetch("/api/reading-list", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (!res.ok) {
        alert("Could not remove from list.");
        return;
      }
      router.refresh();
    } catch (error) {
      console.error("Remove failed:", error);
      alert("Could not remove — check your connection.");
    } finally {
      setRemoving(null);
    }
  }

  async function handleMove(slug: string, status: string) {
    setUpdating(slug);
    try {
      const res = await fetch("/api/reading-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, status }),
      });
      if (!res.ok) {
        alert("Could not move to that list.");
        return;
      }
      setOpenMenu(null);
      router.refresh();
    } catch (error) {
      console.error("Move failed:", error);
      alert("Could not move — check your connection.");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <Navbar />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,1,143,0.12),transparent_30%),radial-gradient(circle_at_70%_20%,rgba(45,12,98,0.2),transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.98)_0%,rgba(11,2,26,0.95)_50%,rgba(0,0,0,1)_100%)]" />

      <div className="relative mx-auto max-w-7xl px-6 pt-28 pb-16 sm:px-10 lg:px-12 z-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-[#f6a1ff] mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>

        <section className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2.5">
            <Library className="h-5 w-5 text-[#f6a1ff]" />
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#f6a1ff]/90">
              Personal Library
            </p>
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
            Your Reading Lists
          </h1>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-white/65 leading-relaxed">
            Organize your collection status and map out what to read next. (
            {entries.length} titles tracked)
          </p>
        </section>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-3 scrollbar-none border-b border-white/5">
          {STATUS_TABS.map((tab) => {
            const isActive = activeTab === tab.value;
            const count = entries.filter((e) => e.status === tab.value).length;

            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 active:scale-95 ${
                  isActive
                    ? "bg-[#ff018f] text-white shadow-[0_0_15px_rgba(255,1,143,0.4)] border border-white/10"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5"
                }`}
              >
                {tab.label}{" "}
                <span className="ml-1.5 opacity-50 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {filtered.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {filtered.map((comic) => (
              <div
                key={comic.slug}
                className="group relative flex flex-col rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-white/5 border-b border-white/5">
                  {/* The cover is a link to the comic */}
                  <Link
                    href={`/${comic.slug}`}
                    className="absolute inset-0 z-0 block"
                  >
                    <Image
                      src={comic.image}
                      alt={comic.title}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
                    />
                  </Link>

                  <span className="absolute top-2 left-2 z-10 inline-flex items-center rounded-lg bg-black/70 backdrop-blur-md border border-white/10 px-2 py-0.5 text-[9px] font-bold tracking-wide text-[#f6a1ff] pointer-events-none">
                    {comic.tag}
                  </span>

                  {/* Overlay lets clicks pass through (pointer-events-none) EXCEPT the buttons */}
                  <div
                    className={`absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-200 flex items-end justify-center p-3 pointer-events-none ${
                      openMenu === comic.slug
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {openMenu === comic.slug ? (
                      <div className="w-full max-h-full overflow-y-auto rounded-lg border border-white/10 bg-[#120529]/95 p-1 pointer-events-auto">
                        {STATUS_TABS.map((s) => (
                          <button
                            key={s.value}
                            onClick={() => handleMove(comic.slug, s.value)}
                            disabled={updating === comic.slug}
                            className={`block w-full rounded px-2 py-1.5 text-left text-[11px] font-semibold transition ${
                              comic.status === s.value
                                ? "bg-[#ff018f]/20 text-[#f6a1ff]"
                                : "text-white/80 hover:bg-white/10"
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                        <button
                          onClick={() => setOpenMenu(null)}
                          className="block w-full rounded px-2 py-1.5 text-left text-[11px] font-semibold text-white/40 hover:bg-white/10"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 w-full pointer-events-auto">
                        <button
                          onClick={() => setOpenMenu(comic.slug)}
                          title="Move to another list"
                          className="flex-1 inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-white/10 hover:bg-[#ff018f] border border-white/10 text-[11px] font-bold text-white transition-all duration-150 active:scale-95"
                        >
                          <ArrowRightLeft className="h-3 w-3" /> Move
                        </button>
                        <button
                          onClick={() => handleRemove(comic.slug)}
                          disabled={removing === comic.slug}
                          title="Remove from library"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 border border-red-500/20 hover:text-white transition-all duration-150 active:scale-95"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3 flex flex-col flex-grow justify-between gap-1">
                  {/* The title is also a link */}
                  <Link
                    href={`/${comic.slug}`}
                    className="font-bold text-sm tracking-wide text-white/90 hover:text-[#ff018f] line-clamp-1 transition-colors"
                  >
                    {comic.title}
                  </Link>
                  <p className="text-[11px] text-white/40 line-clamp-2 leading-relaxed">
                    {comic.description || "No description recorded."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 text-center py-20 rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
            <p className="text-sm text-white/40">
              No comics under &quot;
              {STATUS_TABS.find((t) => t.value === activeTab)?.label}&quot; yet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
