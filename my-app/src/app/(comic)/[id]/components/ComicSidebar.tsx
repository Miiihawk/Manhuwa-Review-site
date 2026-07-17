"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart, Edit3, Info, Tag, User } from "lucide-react";
import type { TabType } from "../page";
import { useState, useEffect } from "react";
import ReadingListButton from "./ReadingListButton";
import Toast from "@/app/components/ui/Toast";

interface ComicSidebarProps {
  comic: {
    title: string;
    image: string;
    author: string;
    averageRating: number | null;
    status: string;
    category: string | null;
    genres: { name: string; slug: string }[];
    favoritesCount: number;
  };
  slug: string;
  setActiveSubTab: (tab: TabType) => void;
  setIsReviewModalOpen: (open: boolean) => void;
}

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, " ");
}

export default function ComicSidebar({
  comic,
  slug,
  setActiveSubTab,
  setIsReviewModalOpen,
}: ComicSidebarProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadStatus() {
      try {
        const res = await fetch(`/api/favorites?slug=${slug}`);
        if (!res.ok) return;
        const data = await res.json();
        if (active) setIsFavorited(data.favorited);
      } catch (error) {
        console.error("Failed to load favorite status:", error);
      }
    }
    loadStatus();
    return () => {
      active = false;
    };
  }, [slug]);

  async function toggleFavorite() {
    const wasFavorited = isFavorited;
    setIsFavorited(!wasFavorited);
    if (wasFavorited) {
      setToastMessage("Removed from Favorites");
    }
    setFavLoading(true);
    try {
      const res = await fetch("/api/favorites", {
        method: wasFavorited ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      if (res.status === 401) {
        setIsFavorited(wasFavorited);
        setToastMessage(null);
        alert("Please log in to favorite comics.");
        return;
      }
      if (!res.ok) {
        setIsFavorited(wasFavorited);
        setToastMessage(null);
        alert("Could not update favorite.");
        return;
      }
    } catch (error) {
      setIsFavorited(wasFavorited);
      setToastMessage(null);
      console.error("Toggle favorite failed:", error);
      alert("Could not update favorite — check your connection.");
    } finally {
      setFavLoading(false);
    }
  }

  const author = comic.author;
  const category = comic.category ?? "Unknown";
  const genres = comic.genres;
  const averageRating =
    comic.averageRating != null ? String(comic.averageRating) : "—";
  const publicationStatus = formatStatus(comic.status);

  const handleWriteReviewClick = () => {
    setActiveSubTab("reviews");
    setIsReviewModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full max-w-[280px] mx-auto lg:mx-0">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
        <Image
          src={comic.image}
          alt={comic.title}
          fill
          priority
          className="object-cover"
          sizes="280px"
        />
      </div>

      <div className="grid grid-cols-4 gap-2 mt-4">
        <button
          onClick={handleWriteReviewClick}
          className="col-span-2 flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[#ff018f] hover:bg-[#ff018f]/90 text-xs font-black transition active:scale-95 text-white shadow-md select-none animate-fade-in"
          title="Write a Review"
        >
          Write a Review <Edit3 className="h-3.5 w-3.5" />
        </button>

        <ReadingListButton slug={slug} />

        <button
          onClick={toggleFavorite}
          disabled={favLoading}
          className={`flex h-11 items-center justify-center rounded-lg border transition active:scale-95 text-[#ff018f] select-none ${
            isFavorited
              ? "bg-[#ff018f]/20 border-[#ff018f]/40"
              : "bg-white/5 hover:bg-white/10 border-white/10"
          }`}
          title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
        >
          <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="flex items-center justify-between mt-6 bg-white/[0.02] border border-white/5 rounded-xl p-4">
        <div className="flex items-center gap-2.5">
          <Star className="h-5 w-5 text-purple-400 fill-current" />
          <div>
            <div className="text-sm font-black">{averageRating}</div>
            <div className="text-[10px] text-white/40 font-medium">Ratings</div>
          </div>
        </div>
        <div className="h-6 w-[1px] bg-white/10" />
        <div className="flex items-center gap-2.5">
          <Heart className="h-5 w-5 text-[#ff018f] fill-current" />
          <div>
            <div className="text-sm font-black">{comic.favoritesCount}</div>
            <div className="text-[10px] text-white/40 font-medium">
              Favorites
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white/[0.01] rounded-xl border border-white/5 p-4 space-y-3.5 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/40">
            <Info className="h-3.5 w-3.5" /> Status
          </div>
          <span className="font-bold uppercase text-emerald-400 tracking-wide text-[11px]">
            ● {publicationStatus}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/40">
            <Tag className="h-3.5 w-3.5" /> Type
          </div>
          <span className="font-bold text-white/80 bg-white/5 px-2 py-0.5 rounded border border-white/5">
            {category}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/40">
            <User className="h-3.5 w-3.5" /> Author
          </div>
          <span className="font-medium text-white/80 text-right">{author}</span>
        </div>
        <div className="flex flex-col gap-1.5 pt-1 border-t border-white/5">
          <div className="text-white/40">Genres</div>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {genres.length > 0 ? (
              genres.map((g) => (
                <Link
                  key={g.slug}
                  href={`/comicseries?genre=${g.slug}`}
                  className="bg-white/5 text-white/70 hover:bg-pink-600 hover:text-white hover:border-pink-500/30 px-2 py-0.5 rounded text-[10px] font-medium border border-white/5 transition-colors"
                >
                  {g.name}
                </Link>
              ))
            ) : (
              <span className="text-white/30 text-[10px]">No genres yet</span>
            )}
          </div>
        </div>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      )}
    </div>
  );
}
