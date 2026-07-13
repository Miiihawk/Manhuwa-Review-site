import ComicCard from "../cards/ComicCard";
import { comicService } from "@/app/lib/services/comic.service";

export default async function RecentlyAddedSection() {
  let recentComics: {
    id: string;
    title: string;
    image: string;
    tag: string;
  }[] = [];

  try {
    const rows = await comicService.listRecentlyAdded();
    recentComics = rows.map((comic) => ({
      id: comic.slug,
      title: comic.title,
      image: comic.coverPhoto,
      tag: comic.publicationStatus,
    }));
  } catch {}

  return (
    <section className="w-full">
      {/* Section Header */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.4em] text-[#f6a1ff]/90">
          Fresh Drops
        </p>
        <h2 className="mt-2 text-2xl font-black flex items-center gap-2">
          Recently Added
        </h2>
      </div>

      {/* Grid Track matching the Highest Rated section layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {recentComics.map((item, index) => (
          <ComicCard key={`recent-${item.title}-${index}`} comic={item} />
        ))}
      </div>
    </section>
  );
}
