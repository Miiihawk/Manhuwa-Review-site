// src/app/components/cards/ComicCard.tsx
import Image from "next/image";

interface ComicCardProps {
  comic?: {
    // Made optional with '?' so it doesn't crash if undefined
    title: string;
    image: string;
    tag: string;
  };
}

export default function ComicCard({ comic }: ComicCardProps) {
  // Safe fallback if a parent component forgets to pass the data object
  if (!comic) {
    return (
      <div className="w-full aspect-[2/3] rounded-2xl bg-white/5 animate-pulse flex items-center justify-center border border-white/5 text-xs text-white/30">
        Loading...
      </div>
    );
  }

  return (
    <article className="group w-full overflow-hidden rounded-2xl bg-white/5 border border-white/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(242,112,156,0.15)] hover:border-pink-500/20">
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <Image
          src={comic.image}
          alt={comic.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#F6A1FF]">
          {comic.tag}
        </span>
        <h3 className="mt-1 font-bold text-sm tracking-wide line-clamp-1 text-white/90 group-hover:text-pink-400 transition-colors">
          {comic.title}
        </h3>
      </div>
    </article>
  );
}
