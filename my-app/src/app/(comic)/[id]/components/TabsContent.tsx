"use client";

import { useState } from "react";
import { Star, MessageSquare, ExternalLink, User } from "lucide-react";
import { TabType } from "../page";
import ReviewFormModal from "./ReviewFormModal";

interface TabsContentProps {
  activeSubTab: TabType;
  comic: {
    title: string;
    description?: string;
  };
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
}

interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  text: string;
}

export default function TabsContent({
  activeSubTab,
  comic,
  isReviewModalOpen,
  setIsReviewModalOpen,
}: TabsContentProps) {
  const [communityReviews, setCommunityReviews] = useState<Review[]>([
    {
      id: "1",
      user: "SoloReader99",
      rating: 10,
      date: "2 days ago",
      text: "Absolutely phenomenal artwork and pacing! The main character transitions perfectly into his modern setting. Highly recommended if you enjoy high-stakes progression systems.",
    },
    {
      id: "2",
      user: "ManhwaEnjoyer",
      rating: 8,
      date: "1 week ago",
      text: "The comedy hits just right and the subversion of classic tropes keeps it extremely fresh. Deducted two points only because the latest arc started a bit slow.",
    },
  ]);

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

  const handleAddReview = (newReview: { text: string; rating: number }) => {
    const formattedReview: Review = {
      id: Date.now().toString(),
      user: "Anonymous Reader",
      rating: newReview.rating * 2,
      date: "Just now",
      text: newReview.text,
    };
    setCommunityReviews([formattedReview, ...communityReviews]);
  };

  return (
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

      {/* VIEW 2: REVIEWS FEED */}
      {activeSubTab === "reviews" && (
        <div className="space-y-4 w-full">
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
            <div className="text-xs text-white/50">
              Share your thoughts about{" "}
              <span className="text-white font-bold">{comic.title}</span> with
              the community.
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="h-9 px-4 bg-[#ff018f] hover:bg-[#ff018f]/90 text-xs font-black rounded-lg transition active:scale-95 shadow-md text-white flex items-center gap-1.5"
            >
              <MessageSquare className="h-3.5 w-3.5" /> Write Review
            </button>
          </div>

          <div className="space-y-3">
            {communityReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-md flex flex-col gap-3 w-full"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                      <User className="h-3.5 w-3.5 text-white/60" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white/90">
                        {rev.user}
                      </div>
                      <div className="text-[10px] text-white/30">
                        {rev.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-[11px] font-bold text-amber-400 flex items-center gap-0.5 bg-amber-400/5 px-2 py-0.5 rounded border border-amber-400/10">
                      <Star className="h-3 w-3 fill-current" /> {rev.rating}/10
                    </div>
                  </div>
                </div>
                <p className="text-xs text-white/70 leading-relaxed font-light whitespace-pre-wrap">
                  {rev.text}
                </p>
              </div>
            ))}
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
              Support the creators by reading the official translations on these
              digital platforms:
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

      {/* RENDER SEPARATED FORM MODAL */}
      {isReviewModalOpen && (
        <ReviewFormModal
          comicTitle={comic.title}
          onClose={() => setIsReviewModalOpen(false)}
          onSubmit={handleAddReview}
        />
      )}
    </div>
  );
}
