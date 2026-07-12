"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Star, Heart, ExternalLink } from "lucide-react";
import Navbar from "../../components/layout/Navbar";

// Pulling your exact data structure directly from comic.ts
import { featuredCovers } from "../../data/comic";

export default function FavoritesPage() {
  // Simulating favorited comics for your frontend (e.g., picking the top 4)
  const favoritedComics = featuredCovers ? featuredCovers.slice(0, 4) : [];
  const totalFavoritesCount = favoritedComics.length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Universal Floating Header Navbar */}
      <Navbar />

      {/* Immersive Background Glows (Matching your design system) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,1,143,0.12),transparent_30%),radial-gradient(circle_at_70%_20%,rgba(45,12,98,0.2),transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.98)_0%,rgba(11,2,26,0.95)_50%,rgba(0,0,0,1)_100%)]" />

      {/* Content Workspace */}
      <div className="relative mx-auto max-w-7xl px-6 pt-28 pb-16 sm:px-10 lg:px-12 z-10">
        {/* Navigation Back Link */}
        <Link
          href="/user/dashboard"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-[#f6a1ff] mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>

        {/* --- HEADER TITLE BANNER --- */}
        <section className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2.5">
            <Heart className="h-5 w-5 text-[#f6a1ff] fill-[#f6a1ff]/20" />
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#f6a1ff]/90">
              Favorites
            </p>
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
            Your Favorites
          </h1>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-white/65 leading-relaxed">
            Save the series you want to come back to and keep them easy to find.
            You have {totalFavoritesCount} titles bookmarked.
          </p>
        </section>

        {/* --- DYNAMIC FAVORITES TILES GRID --- */}
        {favoritedComics.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {favoritedComics.map((comic) => {
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

                    {/* Floating Comic Category/Tag Badge */}
                    <span className="absolute top-2 left-2 z-10 inline-flex items-center rounded-lg bg-black/70 backdrop-blur-md border border-white/10 px-2 py-0.5 text-[9px] font-bold tracking-wide text-[#f6a1ff]">
                      {comic.tag}
                    </span>

                    {/* Hover Action Overlay Panel */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center p-3">
                      <div className="flex items-center gap-1.5 w-full">
                        {/* Quick Navigation Link */}
                        <Link
                          href={`/comics/${comic.title
                            .toLowerCase()
                            .replace(/[^a-z0-w\s]/g, "")
                            .replace(/\s+/g, "-")}`}
                          className="flex-1 inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-white/10 hover:bg-[#ff018f] border border-white/10 text-[11px] font-bold text-white transition-all duration-150 active:scale-95 text-center"
                        >
                          <ExternalLink className="h-3 w-3" /> View
                        </Link>

                        {/* Remove from favorites shortcut */}
                        <button
                          title="Remove from favorites"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 border border-red-500/20 hover:text-white transition-all duration-150 active:scale-95"
                        >
                          <Heart className="h-3.5 w-3.5 fill-current" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Information Text Block */}
                  <div className="p-3 flex flex-col flex-grow justify-between gap-1">
                    <h3 className="font-bold text-sm tracking-wide text-white/90 group-hover:text-white line-clamp-1 transition-colors">
                      {comic.title}
                    </h3>
                    <p className="text-[11px] text-white/40 line-clamp-2 leading-relaxed">
                      {comic.description || "No description recorded."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Favorites Catch Block */
          <div className="mt-8 text-center py-20 rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
            <p className="text-sm text-white/40">
              You haven't added any series to your favorites yet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
