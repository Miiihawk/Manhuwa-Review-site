"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/dist/client/link";

interface ComicItem {
  title: string;
  image: string;
  tag: string;
  description?: string;
}

interface HeroProps {
  // Pass your entire mock array instead of just one item!
  comicList: ComicItem[];
}

export default function Hero({ comicList }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Helper to safely loop through data circularly
  const getComic = (offset: number) => {
    const index = (currentIndex + offset) % comicList.length;
    return comicList[index];
  };

  const activeComic = getComic(0);
  const nextComic = getComic(1);
  const thirdComic = getComic(2);

  // Handle manual or automatic swiping action
  const handleSwipeNext = () => {
    setCurrentIndex((prev) => (prev + 1) % comicList.length);
  };

  const description =
    activeComic.description ||
    "Discover thousands of Manhwa, Manhua, Manga, and Webcomics reviewed by the community.";

  return (
    <section className="relative min-h-[90vh] w-full flex items-center pt-32 pb-16 overflow-hidden">
      {/* Dynamic Ambient Blur Background (Syncs perfectly with current slide image) */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={`bg-${activeComic.title}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-cover bg-center scale-110 blur-3xl"
          style={{ backgroundImage: `url('${activeComic.image}')` }}
        />
      </AnimatePresence>

      {/* Dark Theme Masking Layers */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b021a] via-[#0b021a]/95 to-[#0b021a]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b021a] via-transparent to-transparent" />

      {/* Layout Splitter Wrapper */}
      <div className="relative z-10 w-full mx-auto max-w-7xl px-6 sm:px-10 lg:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Side Column: Text content block with fonts changing elegantly on slide changes */}
        <div className="w-full md:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${activeComic.title}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <p className="text-[#f6a1ff] text-xs font-semibold uppercase tracking-[0.4em]">
                {activeComic.tag || "New"} Comic
              </p>

              <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                {activeComic.title}
              </h1>

              <p className="mt-6 text-base sm:text-lg text-white/70 leading-8 max-w-xl line-clamp-5">
                {description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/comicseries"
              title="Series Catalog"
              className="inline-block rounded-full bg-pink-600 px-8 py-3 text-sm font-black tracking-wide text-white transition hover:bg-pink-500 shadow-lg shadow-pink-600/20 text-center"
            >
              Browse Comics
            </Link>
            <button
              onClick={handleSwipeNext}
              className="rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-black tracking-wide text-white transition hover:bg-white/10"
            >
              Next Slide →
            </button>
          </div>
        </div>

        {/* Right Side Column: Interactive 3D Card Stack Layer */}
        <div className="hidden md:flex md:col-span-5 justify-center lg:justify-start items-center pl-4 lg:pl-12 h-[450px] relative">
          <div className="relative w-full max-w-xs aspect-[2/3]">
            {/* Card 3: Deep Background Card */}
            <div
              className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border border-white/5 opacity-40 translate-x-8 -translate-y-8 scale-90 blur-[1px] transition-all duration-500 pointer-events-none"
              style={{ zIndex: 10 }}
            >
              <img
                src={thirdComic.image}
                alt="Stack Background"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Card 2: Stepping Up Middle Card */}
            <div
              className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border border-white/10 opacity-75 translate-x-4 -translate-y-4 scale-95 transition-all duration-500 pointer-events-none"
              style={{ zIndex: 20 }}
            >
              <img
                src={nextComic.image}
                alt="Stack Next"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Card 1: Main Front Card with full drag-and-swipe control! */}
            <AnimatePresence mode="popLayout">
              {" "}
              {/* Added mode="popLayout" to keep layout smooth during swaps */}
              <motion.div
                key={`card-${activeComic.title}`}
                style={{ zIndex: 30 }}
                className="absolute inset-0 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 cursor-grab active:cursor-grabbing origin-bottom bg-neutral-900"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                whileDrag={{ scale: 1.05 }}
                onDragEnd={(_, info) => {
                  // If dragged sufficiently far to left or right, swipe away!
                  if (Math.abs(info.offset.x) > 100) {
                    handleSwipeNext();
                  }
                }}
                exit={{
                  x: 300,
                  opacity: 0,
                  rotate: 15,
                  transition: { duration: 0.3 },
                }}
                // 1. Explicitly set x: 0 and rotate: 0 on entry so it doesn't copy the old card
                initial={{ scale: 0.95, opacity: 0, x: 0, rotate: 0 }}
                // 2. Explicitly force it back to center (x: 0, rotate: 0) when it animates in
                animate={{ scale: 1, opacity: 1, x: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <img
                  src={activeComic.image}
                  alt={activeComic.title}
                  className="w-full h-full object-cover select-none"
                  draggable="false"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
