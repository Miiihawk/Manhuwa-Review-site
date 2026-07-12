"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MessageSquare } from "lucide-react";

interface SeriesProps {
  series: {
    id: string;
    title: string;
    image: string;
    type: string;
    rating: string;
    status: string;
    totalReviews: number;
    userScore: string;
  };
}

export default function SeriesGridCard({ series }: SeriesProps) {
  return (
    <Link
      href={`/comicseries/${series.id}`}
      className="group block relative overflow-hidden rounded-2xl border border-white/5 bg-[#120529]/40 p-4 backdrop-blur-sm transition-all duration-300 hover:border-pink-500/30 hover:bg-[#120529]/70 hover:shadow-[0_0_30px_rgba(255,1,143,0.1)] active:scale-[0.99]"
    >
      <div className="flex gap-4">
        {/* Comic Cover Image Container */}
        <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-white/5">
          <Image
            src={series.image}
            alt={series.title}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Metadata & Review Details */}
        <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-bold text-white/60 tracking-wider uppercase">
                {series.type}
              </span>
              <span
                className={`text-[10px] font-semibold ${series.status === "Hiatus" ? "text-amber-400/80" : "text-emerald-400/80"}`}
              >
                {series.status}
              </span>
            </div>

            {/* Changed from a Link tag to a regular h2 to keep standard HTML rules happy */}
            <h2 className="mt-2 text-base font-bold leading-snug tracking-wide text-white transition-colors group-hover:text-pink-500 line-clamp-2">
              {series.title}
            </h2>
          </div>

          {/* Quick Stats: Ratings & Reviews */}
          <div className="flex items-center gap-4 text-xs mt-2 w-full">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="font-black text-white">{series.rating}</span>
            </div>

            <div className="flex items-center gap-1 text-white/40">
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="font-medium text-white/75">
                {series.totalReviews.toLocaleString()}
              </span>
            </div>

            <span className="text-[11px] font-semibold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-md ml-auto">
              {series.userScore}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
