"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/layout/Navbar";

// Pulling your exact data structure directly from comic.ts
import { featuredCovers } from "../../data/comic";

function IconBase({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

function ArrowLeftIcon({ className = "" }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </IconBase>
  );
}

function Trash2Icon({ className = "" }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 6l1 14h10l1-14" />
    </IconBase>
  );
}

function ArrowRightLeftIcon({ className = "" }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="m16 3 4 4-4 4" />
      <path d="M20 7H4" />
      <path d="m8 21-4-4 4-4" />
      <path d="M4 17h16" />
    </IconBase>
  );
}

function LibraryIcon({ className = "" }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M3 19.5V5.75A1.75 1.75 0 0 1 4.75 4h14.5A1.75 1.75 0 0 1 21 5.75V19.5" />
      <path d="M7 4v16" />
      <path d="M11 4v16" />
    </IconBase>
  );
}

type ReadingStatus =
  | "Reading"
  | "Completed"
  | "Plan to Read"
  | "On Hold"
  | "Dropped";

export default function ReadingListPage() {
  const [activeTab, setActiveTab] = useState<ReadingStatus>("Reading");

  // Distribute your mock comics across different statuses for frontend simulation
  const getComicsByStatus = (status: ReadingStatus) => {
    if (!featuredCovers) return [];

    switch (status) {
      case "Reading":
        return [featuredCovers[0], featuredCovers[4]];
      case "Completed":
        return [featuredCovers[5]];
      case "Plan to Read":
        return [featuredCovers[1], featuredCovers[3]];
      case "On Hold":
        return [featuredCovers[2]];
      default:
        return [];
    }
  };

  const filteredComics = getComicsByStatus(activeTab);
  const totalLibraryCount = featuredCovers?.length || 0;

  const tabs: ReadingStatus[] = [
    "Reading",
    "Completed",
    "Plan to Read",
    "On Hold",
    "Dropped",
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <Navbar />

      {/* Immersive Background Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,1,143,0.12),transparent_30%),radial-gradient(circle_at_70%_20%,rgba(45,12,98,0.2),transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.98)_0%,rgba(11,2,26,0.95)_50%,rgba(0,0,0,1)_100%)]" />

      {/* Content Workspace */}
      <div className="relative mx-auto max-w-7xl px-6 pt-28 pb-16 sm:px-10 lg:px-12 z-10">
        {/* Navigation Back Link */}
        <Link
          href="/user/dashboard"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-[#f6a1ff] mb-8 group"
        >
          <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>

        {/* --- HEADER TITLE BANNER --- */}
        <section className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2.5">
            <LibraryIcon className="h-5 w-5 text-[#f6a1ff]" />
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#f6a1ff]/90">
              Personal Library
            </p>
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
            Your Reading Lists
          </h1>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-white/65 leading-relaxed">
            Organize your collection status, jump back into your current
            favorites, and map out what to read next. ({totalLibraryCount}{" "}
            titles tracked)
          </p>
        </section>

        {/* --- READING STATUS TAB CONTROLLERS --- */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-3 scrollbar-none border-b border-white/5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            const count = getComicsByStatus(tab).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 active:scale-95 ${
                  isActive
                    ? "bg-[#ff018f] text-white shadow-[0_0_15px_rgba(255,1,143,0.4)] border border-white/10"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5"
                }`}
              >
                {tab}{" "}
                <span className="ml-1.5 opacity-50 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* --- DYNAMIC FILTERED TILES GRID --- */}
        {filteredComics.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {filteredComics.map((comic) => {
              return (
                <div
                  key={comic.title}
                  className="group relative flex flex-col rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                >
                  {/* Aspect Ratio Boxed Comic Cover Tile */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-white/5 border-b border-white/5">
                    <Image
                      src={comic.image}
                      alt={comic.title}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(max-w-640px) 50vw, (max-w-1024px) 25vw, 15vw"
                    />

                    {/* Floating Accent Metadata Tag Badge */}
                    <span className="absolute top-2 left-2 z-10 inline-flex items-center rounded-lg bg-black/70 backdrop-blur-md border border-white/10 px-2 py-0.5 text-[9px] font-bold tracking-wide text-[#f6a1ff]">
                      {comic.tag}
                    </span>

                    {/* Hover Hotbar Action Drop Shadow Overlay Panel */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center p-3">
                      <div className="flex items-center gap-1.5 w-full">
                        <button
                          title="Move to another list"
                          className="flex-1 inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-white/10 hover:bg-[#ff018f] border border-white/10 text-[11px] font-bold text-white transition-all duration-150 active:scale-95"
                        >
                          <ArrowRightLeftIcon className="h-3 w-3" /> Move
                        </button>
                        <button
                          title="Remove from library entirely"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 border border-red-500/20 hover:text-white transition-all duration-150 active:scale-95"
                        >
                          <Trash2Icon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Text Body Information Container */}
                  <div className="p-3 flex flex-col flex-grow justify-between gap-1">
                    <h3 className="font-bold text-sm tracking-wide text-white/90 group-hover:text-white line-clamp-1 transition-colors">
                      {comic.title}
                    </h3>
                    <p className="text-[11px] text-white/40 line-clamp-2 leading-relaxed">
                      {comic.description || "No review details recorded."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 text-center py-20 rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
            <p className="text-sm text-white/40">
              No comics currently listed under "{activeTab}"
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
