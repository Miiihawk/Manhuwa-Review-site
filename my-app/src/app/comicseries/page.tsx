import Navbar from "../components/layout/Navbar";
import SeriesGridCard from "../components/cards/SeriesGridCard";
import DirectoryControls from "./DirectoryControls";
import { comicService } from "@/app/lib/services/comic.service";
import { genreService } from "@/app/lib/services/genre.service";

export const dynamic = "force-dynamic";

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function scoreLabel(avg: number | null) {
  if (avg == null) return "Unrated";
  if (avg >= 5) return "Masterpiece";
  if (avg >= 4) return "Great";
  if (avg >= 3) return "Good";
  if (avg >= 2) return "Fair";
  return "Poor";
}

export default async function ComicSeriesPage({
  searchParams,
}: {
  searchParams: Promise<{
    sort?: string;
    status?: string;
    type?: string;
    genre?: string;
  }>;
}) {
  const params = await searchParams;

  let series: {
    id: string;
    title: string;
    image: string;
    type: string;
    rating: string;
    status: string;
    totalReviews: number;
    userScore: string;
  }[] = [];
  let categories: { value: string; label: string }[] = [];
  let genres: { value: string; label: string }[] = [];

  try {
    const [comics, cats, gens] = await Promise.all([
      comicService.listDirectory({
        sort: params.sort,
        status: params.status,
        categorySlug: params.type,
        genreSlug: params.genre,
      }),
      comicService.listCategories(),
      genreService.listGenres(),
    ]);

    series = comics.map((c) => ({
      id: c.slug,
      title: c.title,
      image: c.coverPhoto,
      type: c.category?.name ?? "Unknown",
      rating: c.averageRating != null ? (c.averageRating * 2).toFixed(1) : "—",
      status: formatStatus(c.publicationStatus),
      totalReviews: c._count.reviews,
      userScore: scoreLabel(c.averageRating),
    }));
    categories = cats.map((c) => ({ value: c.slug, label: c.name }));
    genres = gens.map((g) => ({ value: g.slug, label: g.name }));
  } catch (error) {
    console.error("Series directory: failed to load:", error);
  }

  return (
    <main className="min-h-screen bg-[#0b021a] text-white pt-28 pb-16">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12 mt-8">
        <div className="max-w-2xl mb-10 text-left">
          <h1 className="text-4xl font-black tracking-wide flex items-center justify-start gap-3">
            Series Directory
          </h1>
          <p className="text-xs text-white/50 tracking-wide mt-3 font-light">
            Discover community ratings, read comprehensive breakdowns, and share
            your own reviews.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-4 mb-8 gap-4">
          <div className="text-xs text-white/50 font-medium">
            Found <span className="text-white font-bold">{series.length}</span>{" "}
            indexed series
          </div>

          <DirectoryControls categories={categories} genres={genres} />
        </div>

        {series.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {series.map((s) => (
              <SeriesGridCard key={s.id} series={s} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
            <p className="text-sm text-white/40">
              No series match your filters.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
