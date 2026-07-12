// src/app/components/sections/HighestRatedSection.tsx
import ComicCard from "../cards/ComicCard";
// Import your local data array
import { featuredCovers } from "../../data/comic";

export default function HighestRatedSection() {
  // Optional: If your mock data has ratings later, you could sort it here.
  // For now, we'll map your existing items straight through!

  return (
    <section className="w-full">
      {/* Visual Header Alignment */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.4em] text-[#f6a1ff]/90">
          Community Favorites
        </p>
        <h2 className="mt-2 text-2xl font-black flex items-center gap-2">
          Highest Rated
        </h2>
      </div>

      {/* Grid Layout Track matching your responsive break-points */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {featuredCovers.map((comic, index) => (
          <ComicCard key={`${comic.title}-${index}`} comic={comic} />
        ))}
      </div>
    </section>
  );
}
