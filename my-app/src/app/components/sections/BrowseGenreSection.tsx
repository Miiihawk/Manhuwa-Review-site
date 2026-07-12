// src/app/components/sections/BrowseGenreSection.tsx

const genres = [
  "Action",
  "Fantasy",
  "Romance",
  "Drama",
  "Comedy",
  "Horror",
  "Adventure",
  "Sci-Fi",
];

export default function BrowseGenreSection() {
  return (
    <section className="w-full">
      {/* Section Header */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.4em] text-[#f6a1ff]/90">
          Find Your Vibe
        </p>
        <h2 className="mt-2 text-2xl font-black flex items-center gap-2">
          Browse by Genre
        </h2>
      </div>

      {/* Styled Interactive Flex Wrap Track */}
      <div className="flex flex-wrap gap-3 sm:gap-4">
        {genres.map((genre) => (
          <button
            key={genre}
            className="rounded-full bg-white/5 border border-white/5 px-6 py-2.5 text-sm font-bold tracking-wide text-white/90 transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-600 hover:text-white hover:border-pink-500/30 hover:shadow-[0_0_20px_rgba(219,39,119,0.4)] active:scale-95"
          >
            {genre}
          </button>
        ))}
      </div>
    </section>
  );
}
