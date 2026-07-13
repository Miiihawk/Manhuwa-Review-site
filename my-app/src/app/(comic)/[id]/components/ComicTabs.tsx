"use client";

import { FileText, MessageSquare, Link2 } from "lucide-react";
import { TabType } from "../page";

interface ComicTabsProps {
  activeSubTab: TabType;
  setActiveSubTab: (tab: TabType) => void;
  totalReviews: string;
}

export default function ComicTabs({
  activeSubTab,
  setActiveSubTab,
  totalReviews,
}: ComicTabsProps) {
  return (
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
        <MessageSquare className="h-3.5 w-3.5" /> Reviews ({totalReviews})
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
  );
}
