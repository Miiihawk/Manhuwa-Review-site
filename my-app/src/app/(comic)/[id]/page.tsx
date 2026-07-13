"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Navbar from "../../components/layout/Navbar";
import ComicSidebar from "./components/ComicSidebar";
import ComicTabs from "./components/ComicTabs";
import TabsContent from "./components/TabsContent";

import { featuredCovers } from "../../data/comic";

export type TabType = "synopsis" | "reviews" | "sources";

export default function StaticComicDetailsPage() {
  const params = useParams<{ id?: string }>();
  const comicId = typeof params.id === "string" ? params.id : "";
  const comic = featuredCovers.find((entry) => entry.id === comicId);
  const [activeSubTab, setActiveSubTab] = useState<TabType>("reviews");
  // Shared state controlling the popup visibility globally
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  if (!comic) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-sm text-white/45">
          No matching webcomic records found.
        </p>
      </div>
    );
  }

  const totalReviews = "6";

  return (
    <main className="relative min-h-screen bg-[#0b021a] text-white font-sans antialiased overflow-x-hidden">
      <Navbar />

      <div className="absolute top-0 left-0 right-0 h-[60vh] opacity-[0.06] blur-xl pointer-events-none select-none z-0">
        <Image
          src={comic.image}
          alt=""
          fill
          className="object-cover scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d0d0f]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start mt-4">
          {/* LEFT SIDEBAR COLUMN */}
          <ComicSidebar
            comic={comic}
            setActiveSubTab={setActiveSubTab}
            setIsReviewModalOpen={setIsReviewModalOpen}
          />

          {/* RIGHT MAIN PANEL COLUMN */}
          <div className="flex flex-col">
            <p className="text-xs text-white/40 font-medium tracking-wide">
              {comic.title} / Alternative Titles
            </p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              {comic.title}
            </h1>

            <ComicTabs
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
              totalReviews={totalReviews}
            />

            <TabsContent
              activeSubTab={activeSubTab}
              comic={comic}
              isReviewModalOpen={isReviewModalOpen}
              setIsReviewModalOpen={setIsReviewModalOpen}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
