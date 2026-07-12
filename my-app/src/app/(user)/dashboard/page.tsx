import Image from "next/image";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import "@/app/styles/dashboard.css";

// Dynamic Local Mock Datasets
import { featuredCovers } from "../../data/comic";

// Modular Section Components
import Hero from "../../components/sections/Hero";
import FeaturedCoverSection from "../../components/sections/FeaturedCoverSection";
import HighestRatedSection from "../../components/sections/HighestRatedSection";
import RecentlyAddedSection from "../../components/sections/RecentlyAddedSection";
import BrowseGenreSection from "../../components/sections/BrowseGenreSection";
import CommunityReviewSection from "../../components/sections/CommunityReviewSection";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#0b021a] text-white overflow-x-hidden flex flex-col justify-between">
      {/* Immersive Top Banner Container */}
      <div className="relative w-full">
        {/* Reusable Header Navbar Component */}
        <Navbar />
        {/* Dynamic Interactive Swipe Deck Hero */}
        <Hero comicList={featuredCovers} />
      </div>

      {/* Grid Dashboard Content Core Stack */}
      {/* Changed pb-16 to pb-0 so there isn't double spacing between the content stack and the footer */}
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 pb-0 sm:px-10 lg:px-12 -mt-10 relative z-20 flex-1">
        {/* Endless Automatic Ticker Tracks */}
        <FeaturedCoverSection />

        {/* Clean Categorized Content Rows */}
        <div className="space-y-16 mb-16">
          <BrowseGenreSection />
          <HighestRatedSection />
          <RecentlyAddedSection />
          <CommunityReviewSection />
        </div>
      </section>

      {/* 2. Reusable Footer Component placed at the very bottom */}
      <Footer />
    </main>
  );
}
