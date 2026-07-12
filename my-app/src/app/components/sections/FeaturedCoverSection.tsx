// src/app/components/sections/FeaturedCoversSection.tsx
import Image from "next/image";
import { featuredCovers } from "../../data/comic";

export default function FeaturedCoversSection() {
  // Create the double array sequence to construct the endless sliding animation ticker look
  const loopingCovers = [...featuredCovers, ...featuredCovers];

  return (
    <div className="bg-transparent py-2 w-full">
      {/* Track Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#f6a1ff]/90">
            Featured Covers
          </p>
          <h2 className="mt-2 text-2xl font-black">Current Picks</h2>
        </div>
      </div>

      {/* Infinite Animated Sliding Rail Window */}
      <div className="mt-6 w-full overflow-hidden pb-2">
        <div className="ticker-track">
          {loopingCovers.map((cover, index) => (
            <article
              key={`${cover.title}-${index}`}
              className="w-52 shrink-0 overflow-hidden rounded-3xl bg-white/5 transition duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(242,112,156,0.25)] border border-white/5"
            >
              <div className="relative aspect-[2/3]">
                <Image
                  src={cover.image}
                  alt={cover.title}
                  fill
                  sizes="208px"
                  className="object-cover transition duration-500 hover:scale-105"
                  priority={index < 6} // Optimizes LCP image loading speeds on viewport arrival
                />
              </div>
              <div className="p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#F6A1FF] font-semibold">
                  {cover.tag}
                </p>
                <h3 className="mt-2 font-bold line-clamp-1 text-sm tracking-wide text-white/95">
                  {cover.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
