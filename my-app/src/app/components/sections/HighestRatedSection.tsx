import ComicCard from "../cards/ComicCard";
import { comicService } from "@/app/lib/services/comic.service";

export default async function HighestRatedSection() {
  let comics: {
    id: string;
    title: string;
    image: string;
    tag: string;
  }[] = [];

  try {
    const rows = await comicService.listHighestRated();
    comics = rows.map((comic) => ({
      id: comic.slug,
      title: comic.title,
      image: comic.coverPhoto,
      tag: comic.publicationStatus,
    }));
  } catch (error) {
    console.error("Error fetching featured covers:", error);
  }
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
        {comics.map((comic, index) => (
          <ComicCard key={`${comic.title}-${index}`} comic={comic} />
        ))}
      </div>
    </section>
  );
}
