import Link from "next/link";
import { genreService } from "@/app/lib/services/genre.service";

export default async function BrowseGenreSection() {
  let genres: { id: number; name: string; slug: string; count: number }[] = [];

  try {
    const rows = await genreService.listGenres();
    genres = rows
      .filter((g) => g._count.comics > 0)
      .map((g) => ({
        id: g.id,
        name: g.name,
        slug: g.slug,
        count: g._count.comics,
      }));
  } catch (error) {
    console.error("Error fetching genres:", error);
  }

  if (genres.length === 0) return null;

  return (
    <section className="w-full">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.4em] text-[#f6a1ff]/90">
          Find Your Vibe
        </p>
        <h2 className="mt-2 text-2xl font-black flex items-center gap-2">
          Browse by Genre
        </h2>
      </div>

      <div className="flex flex-wrap gap-3 sm:gap-4">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            href={`/comicseries?genre=${genre.slug}`}
            className="inline-flex items-center rounded-full bg-white/5 border border-white/5 px-6 py-2.5 text-sm font-bold tracking-wide text-white/90 transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-600 hover:text-white hover:border-pink-500/30 hover:shadow-[0_0_20px_rgba(219,39,119,0.4)] active:scale-95"
          >
            {genre.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
