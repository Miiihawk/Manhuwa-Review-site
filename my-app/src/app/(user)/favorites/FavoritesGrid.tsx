"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ExternalLink } from "lucide-react";
import Toast from "@/app/components/UI/Toast";

interface FavoriteComic {
  slug: string;
  title: string;
  image: string;
  tag: string;
  description: string;
}

export default function FavoritesGrid({
  initialComics,
}: {
  initialComics: FavoriteComic[];
}) {
  const [comics, setComics] = useState(initialComics);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [removingSlug, setRemovingSlug] = useState<string | null>(null);

  async function handleRemove(slug: string) {
    const previous = comics;
    // Optimistic: drop the tile and show the toast immediately, then confirm with the API.
    setComics((prev) => prev.filter((c) => c.slug !== slug));
    setToastMessage("Removed from Favorites");
    setRemovingSlug(slug);
    try {
      const res = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      if (!res.ok) {
        setComics(previous); // rollback
        setToastMessage(null);
        alert("Could not remove favorite.");
      }
    } catch (error) {
      setComics(previous); // rollback
      setToastMessage(null);
      console.error("Remove favorite failed:", error);
      alert("Could not remove favorite — check your connection.");
    } finally {
      setRemovingSlug(null);
    }
  }

  return (
    <>
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
          You have {comics.length} titles bookmarked.
        </p>
      </section>

      {comics.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {comics.map((comic) => (
            <div
              key={comic.slug}
              className="group relative flex flex-col rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-white/5 border-b border-white/5">
                <Image
                  src={comic.image}
                  alt={comic.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
                />

                <span className="absolute top-2 left-2 z-10 inline-flex items-center rounded-lg bg-black/70 backdrop-blur-md border border-white/10 px-2 py-0.5 text-[9px] font-bold tracking-wide text-[#f6a1ff]">
                  {comic.tag}
                </span>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center p-3">
                  <div className="flex items-center gap-1.5 w-full">
                    <Link
                      href={`/${comic.slug}`}
                      className="flex-1 inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-white/10 hover:bg-[#ff018f] border border-white/10 text-[11px] font-bold text-white transition-all duration-150 active:scale-95 text-center"
                    >
                      <ExternalLink className="h-3 w-3" /> View
                    </Link>

                    <button
                      onClick={() => handleRemove(comic.slug)}
                      disabled={removingSlug === comic.slug}
                      title="Remove from favorites"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 border border-red-500/20 hover:text-white transition-all duration-150 active:scale-95 disabled:opacity-50"
                    >
                      <Heart className="h-3.5 w-3.5 fill-current" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 flex flex-col flex-grow justify-between gap-1">
                <h3 className="font-bold text-sm tracking-wide text-white/90 group-hover:text-white line-clamp-1 transition-colors">
                  {comic.title}
                </h3>
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
            You haven't added any series to your favorites yet.
          </p>
        </div>
      )}

      {toastMessage && (
        <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      )}
    </>
  );
}
