import Link from "next/link";
import Image from "next/image";
import { featuredCovers } from "../../data/comic";

export default function FeaturedCoversSection() {
  const loopingCovers = [...featuredCovers, ...featuredCovers]; //[cite: 5]

  return (
    <div className="bg-transparent py-2 w-full">
      {" "}
      {/*[cite: 5] */}
      <div className="flex items-center justify-between">
        {" "}
        {/*[cite: 5] */}
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#f6a1ff]/90">
            {" "}
            {/*[cite: 5] */}
            Featured Covers
          </p>
          <h2 className="mt-2 text-2xl font-black">Current Picks</h2>{" "}
          {/*[cite: 5] */}
        </div>
      </div>
      <div className="mt-6 w-full overflow-hidden pb-2">
        {" "}
        {/*[cite: 5] */}
        <div className="ticker-track">
          {" "}
          {/*[cite: 5] */}
          {loopingCovers.map((cover, index) => {
            const comicId = "1"; // Fallback identifier safeguard

            return (
              <Link
                key={`${cover.title}-${index}`} //[cite: 5]
                href={`/comic/${comicId}`}
                className="group w-52 shrink-0 block overflow-hidden rounded-3xl bg-white/5 transition duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(242,112,156,0.25)] border border-white/5" //[cite: 5]
              >
                <div className="relative aspect-[2/3]">
                  {" "}
                  {/*[cite: 5] */}
                  <Image
                    src={cover.image} //[cite: 5]
                    alt={cover.title} //[cite: 5]
                    fill
                    sizes="208px" //[cite: 5]
                    className="object-cover transition duration-500 group-hover:scale-105"
                    priority={index < 6} //[cite: 5]
                  />
                </div>
                <div className="p-4">
                  {" "}
                  {/*[cite: 5] */}
                  <p className="text-xs uppercase tracking-[0.3em] text-[#F6A1FF] font-semibold">
                    {" "}
                    {/*[cite: 5] */}
                    {cover.tag} {/*[cite: 5] */}
                  </p>
                  <h3 className="mt-2 font-bold line-clamp-1 text-sm tracking-wide text-white/95 group-hover:text-[#ff018f] transition-colors">
                    {cover.title} {/*[cite: 5] */}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
