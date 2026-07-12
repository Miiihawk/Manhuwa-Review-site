"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Bookmark,
  Heart,
  ExternalLink,
  Flag,
  MessageSquare,
  FileText,
  User,
  Tag,
  Info,
  Link2,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";

// Pulling your exact data structure directly from comic.ts
import { featuredCovers } from "../../data/comic";

type TabType = "synopsis" | "reviews" | "sources";

export default function StaticComicDetailsPage() {
  const comic = featuredCovers?.[0];

  // Tab control state switcher
  const [activeSubTab, setActiveSubTab] = useState<TabType>("reviews");

  if (!comic) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-sm text-white/45">
          No matching webcomic records found.
        </p>
      </div>
    );
  }

  // Frontend mock values
  const author = "Fanmison / Luminara";
  const category = comic.type;
  const genres = ["Action", "Fantasy", "Drama", "Shonen"];
  const averageRating = "4.8";
  const totalReviews = "6";
  const publicationStatus: "Ongoing" | "Completed" | "Cancelled" | "Hiatus" =
    "Ongoing";

  const officialSources = [
    {
      name: "WEBTOON",
      url: "https://www.webtoons.com",
      logoColor: "bg-[#00f56e]/10 text-[#00f56e] border-[#00f56e]/20",
    },
    {
      name: "Tapas",
      url: "https://tapas.io",
      logoColor: "bg-[#ffcc00]/10 text-[#ffcc00] border-[#ffcc00]/20",
    },
    {
      name: "Tappytoon",
      url: "https://www.tappytoon.com",
      logoColor: "bg-[#00a2ff]/10 text-[#00a2ff] border-[#00a2ff]/20",
    },
  ];

  return (
    <main className="relative min-h-screen bg-[#0d0d0f] text-white font-sans antialiased overflow-x-hidden">
      <Navbar />

      {/* Blurred aesthetic mesh backdrop glow wrapper */}
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
          {/* ================= LEFT ASSET SIDEBAR ================= */}
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

            {/* Main CTA layout buttons */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => setActiveSubTab("sources")}
                className="flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[#ff018f] hover:bg-[#ff018f]/90 text-xs font-black transition active:scale-98 text-white shadow-md"
              >
                Add to Favorites <ExternalLink className="h-3 w-3" />
              </button>
              <button className="flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-xs font-black transition active:scale-98 text-white">
                <Bookmark className="h-3.5 w-3.5 fill-current" /> Library List
              </button>
            </div>

            {/* Global Score Ratings Box */}
            <div className="flex items-center justify-between mt-6 bg-white/[0.02] border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2.5">
                <Star className="h-5 w-5 text-purple-400 fill-current" />
                <div>
                  <div className="text-sm font-black">{averageRating}</div>
                  <div className="text-[10px] text-white/40 font-medium">
                    Ratings
                  </div>
                </div>
              </div>
              <div className="h-6 w-[1px] bg-white/10" />
              <div className="flex items-center gap-2.5">
                <Heart className="h-5 w-5 text-[#ff018f] fill-current" />
                <div>
                  <div className="text-sm font-black">1.7K</div>
                  <div className="text-[10px] text-white/40 font-medium">
                    Favorites
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Data Fields */}
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
                <span className="font-medium text-white/80 text-right">
                  {author}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 pt-1 border-t border-white/5">
                <div className="text-white/40">Genres</div>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {genres.map((g) => (
                    <span
                      key={g}
                      className="bg-white/5 text-white/70 px-2 py-0.5 rounded text-[10px] font-medium border border-white/5"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT MAIN PANEL COLUMN ================= */}
          <div className="flex flex-col">
            <p className="text-xs text-white/40 font-medium tracking-wide">
              {comic.title} / Alternative Titles
            </p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              {comic.title}
            </h1>

            {/* ================= THREE TAB CONTROLLER MENU ================= */}
            <div className="flex items-center mt-6 overflow-x-auto pb-0.5 scrollbar-none border-b border-white/5 w-full">
              {/* Tab 1: Synopsis */}
              <button
                onClick={() => setActiveSubTab("synopsis")}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-black tracking-wide transition-all duration-150 rounded-t-xl select-none ${
                  activeSubTab === "synopsis"
                    ? "bg-[#ff018f] text-white shadow-[0_-2px_10px_rgba(255,1,143,0.2)]"
                    : "text-white/40 hover:text-white border-b-2 border-transparent hover:border-white/10"
                }`}
              >
                <FileText className="h-3.5 w-3.5" /> Synopsis
              </button>

              {/* Tab 2: Reviews */}
              <button
                onClick={() => setActiveSubTab("reviews")}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-black tracking-wide transition-all duration-150 rounded-t-xl select-none ${
                  activeSubTab === "reviews"
                    ? "bg-[#ff018f] text-white shadow-[0_-2px_10px_rgba(255,1,143,0.2)]"
                    : "text-white/40 hover:text-white border-b-2 border-transparent hover:border-white/10"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" /> Reviews (
                {totalReviews})
              </button>

              {/* Tab 3: Official Sources */}
              <button
                onClick={() => setActiveSubTab("sources")}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-black tracking-wide transition-all duration-150 rounded-t-xl select-none ${
                  activeSubTab === "sources"
                    ? "bg-[#ff018f] text-white shadow-[0_-2px_10px_rgba(255,1,143,0.2)]"
                    : "text-white/40 hover:text-white border-b-2 border-transparent hover:border-white/10"
                }`}
              >
                <Link2 className="h-3.5 w-3.5" /> Sources
              </button>
            </div>

            {/* ================= DYNAMIC CONTENT VIEWS ================= */}
            <div className="mt-5 min-h-[340px]">
              {/* VIEW 1: SYNOPSIS */}
              {activeSubTab === "synopsis" && (
                <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-md">
                  <p className="text-sm text-white/70 leading-relaxed font-light">
                    {comic.description ||
                      "No full overview summary has been provided for this series."}
                  </p>
                </div>
              )}

              {/* VIEW 2: REVIEWS */}
              {activeSubTab === "reviews" && (
                <div className="p-6 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-md flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-2 text-white/90 font-bold text-sm mb-1">
                    <MessageSquare className="h-4 w-4 text-[#ff018f]" /> Write a
                    review
                  </div>
                  <p className="text-xs text-white/50 mb-6">
                    Enjoy {comic.title}?
                  </p>

                  <div className="w-full max-w-xl border border-white/10 rounded-xl bg-black/40 overflow-hidden text-left p-4">
                    <div className="flex gap-4 text-xs text-white/30 border-b border-white/5 pb-2.5 mb-3 font-mono">
                      <span className="font-black text-white/60 hover:text-white cursor-pointer">
                        B
                      </span>
                      <span className="italic text-white/60 hover:text-white cursor-pointer">
                        I
                      </span>
                      <span className="line-through text-white/60 hover:text-white cursor-pointer">
                        S
                      </span>
                    </div>
                    <textarea
                      placeholder="Write your review here..."
                      className="w-full bg-transparent border-none text-xs text-white/80 placeholder-white/20 focus:outline-none resize-none h-24"
                    />
                  </div>

                  <div className="mt-6 flex flex-col items-center gap-2">
                    <div className="text-xs font-bold tracking-wide text-white/80">
                      Your Final Rating:
                    </div>
                    <div className="h-10 w-10 rounded-full bg-[#ff018f] text-white flex items-center justify-center font-black text-sm shadow-[0_0_15px_rgba(255,1,143,0.5)]">
                      10
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>

                  <div className="w-full max-w-xl flex items-center justify-between border-t border-white/5 mt-6 pt-4">
                    <div className="text-[10px] text-white/30 text-left leading-tight">
                      Please ensure reviews remain respectful <br /> and adhere
                      to community guidelines.
                    </div>
                    <button className="h-9 px-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-xs font-black text-white/40 cursor-not-allowed transition">
                      Submit
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW 3: OFFICIAL READING SOURCES */}
              {activeSubTab === "sources" && (
                <div className="p-6 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-md">
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-white/90">
                      Official Legal Platforms
                    </h3>
                    <p className="text-xs text-white/40 mt-0.5">
                      Support the creators by reading the official translations
                      on these digital platforms:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mt-4">
                    {officialSources.map((source) => (
                      <a
                        key={source.name}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all group active:scale-98"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-8 px-2.5 flex items-center justify-center rounded-lg border text-[10px] font-black tracking-wider uppercase ${source.logoColor}`}
                          >
                            {source.name.substring(0, 2)}
                          </div>
                          <span className="text-xs font-bold text-white/80 group-hover:text-white transition-colors">
                            Read on {source.name}
                          </span>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 text-white/30 group-hover:text-[#ff018f] transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Community Reviews Feed Banner */}
            <div className="mt-8 border-t border-white/5 pt-6">
              <div className="flex items-center gap-2 text-white/90 mb-4">
                <div className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black">Community Reviews</h3>
                  <p className="text-[10px] text-white/40">
                    {totalReviews} reviews posted by users
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] text-xs text-white/65 leading-relaxed italic">
                "{comic.description}"
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
