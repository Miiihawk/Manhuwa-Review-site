import Link from "next/link";
import Image from "next/image";
import { comicService } from "@/app/lib/services/comic.service";

export default async function FeaturedCoversSection() {
  let featuredCovers: {
    id: string;
    title: string;
    image: string;
    tag: string;
  }[] = [];

  try {
    const comics = await comicService.listComics();
    featuredCovers = comics.map((comic) => ({
      id: comic.slug,
      title: comic.title,
      image: comic.coverPhoto,
      tag: comic.publicationStatus,
    }));
  } catch (error) {
    console.error("Error fetching featured covers:", error);
  }

  const loopingCovers = [...featuredCovers, ...featuredCovers]; // Duplicate for seamless looping

  return (
    <div className="bg-transparent py-2 w-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#f6a1ff]/90">
            Featured Covers
          </p>
          <h2 className="mt-2 text-2xl font-black">Current Picks</h2>
        </div>
      </div>
      <div className="mt-6 w-full overflow-hidden pb-2">
        <div className="ticker-track">
          {loopingCovers.map((cover, index) => (
            <Link
              key={`${cover.title}-${index}`}
              href={`/${cover.id}`}
              className="group w-52 shrink-0 block overflow-hidden rounded-3xl bg-white/5 transition duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(242,112,156,0.25)] border border-white/5"
            >
              <div className="relative aspect-[2/3]">
                <Image
                  src={cover.image}
                  alt={cover.title}
                  fill
                  sizes="208px"
                  className="object-cover transition duration-500 group-hover:scale-105"
                  priority={index < 6}
                />
              </div>
              <div className="p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#F6A1FF] font-semibold">
                  {cover.tag}
                </p>
                <h3 className="mt-2 font-bold line-clamp-1 text-sm tracking-wide text-white/95 group-hover:text-[#ff018f] transition-colors">
                  {cover.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
