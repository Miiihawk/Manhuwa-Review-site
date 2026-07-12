import Navbar from "../components/layout/Navbar";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import SeriesGridCard from "../components/cards/SeriesGridCard";

const seriesDirectoryData = [
  {
    id: "debut-or-die",
    title: "Debut or Die",
    image: "/images/covers/Debut%20or%20Die.jpg",
    type: "Manhwa",
    rating: "8.58",
    status: "Ongoing",
    totalReviews: 1420,
    userScore: "Excellent",
  },
  {
    id: "life-of-a-quack-healer",
    title: "Life of a Quack Healer",
    image: "/images/covers/life%20of%20a%20quck%20healer.jpg",
    type: "Manhwa",
    rating: "8.12",
    status: "Ongoing",
    totalReviews: 834,
    userScore: "Very Good",
  },
  {
    id: "the-player-hides-his-past",
    title: "The Player Hides His Past",
    image: "/images/covers/The%20player%20hides%20his%20past.jpg",
    type: "Manhwa",
    rating: "7.80",
    status: "Ongoing",
    totalReviews: 512,
    userScore: "Good",
  },
  {
    id: "the-ultimate-shut-in",
    title: "The Ultimate Shut In",
    image: "/images/covers/The%20Ultimate%20Shut%20in.jpg",
    type: "Manhwa",
    rating: "8.45",
    status: "Hiatus",
    totalReviews: 923,
    userScore: "Great",
  },
  {
    id: "return-of-the-mad-demon",
    title: "Return of The Mad Demon",
    image: "/images/covers/Return%20of%20the%20Mad%20Demon.jpg",
    type: "Manhwa",
    rating: "8.09",
    status: "Ongoing",
    totalReviews: 2415,
    userScore: "Very Good",
  },
  {
    id: "the-greatest-estate-developer",
    title: "The Greatest Estate Developer",
    image: "/images/covers/The%20Greatest%20Estate%20Developer.jpg",
    type: "Manhwa",
    rating: "9.24",
    status: "Ongoing",
    totalReviews: 4189,
    userScore: "Masterpiece",
  },
];

export default function ComicSeriesPage() {
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
            Found{" "}
            <span className="text-white font-bold">
              {seriesDirectoryData.length}
            </span>{" "}
            indexed series
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white/80 border border-white/5 transition active:scale-95">
              <ArrowUpDown className="h-3.5 w-3.5 text-pink-500" /> Highest
              Rated <span className="text-white/30 font-light">Descending</span>
            </button>
            <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white/80 border border-white/5 transition active:scale-95">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seriesDirectoryData.map((series) => (
            <SeriesGridCard key={series.id} series={series} />
          ))}
        </div>
      </div>
    </main>
  );
}
