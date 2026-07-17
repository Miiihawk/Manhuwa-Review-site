import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { auth } from "@/app/lib/auth";
import { favoriteService } from "@/app/lib/services/favorite.service";
import FavoritesGrid from "./FavoritesGrid";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  let favoritedComics: {
    slug: string;
    title: string;
    image: string;
    tag: string;
    description: string;
  }[] = [];

  try {
    const session = await auth();
    if (session?.user) {
      const favorites = await favoriteService.listForUser(
        Number(session.user.id),
      );
      favoritedComics = favorites.map((fav) => ({
        slug: fav.comic.slug,
        title: fav.comic.title,
        image: fav.comic.coverPhoto,
        tag: fav.comic.publicationStatus,
        description: fav.comic.synopsis,
      }));
    }
  } catch (error) {
    console.error("Favorites page: failed to load favorites:", error);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <Navbar />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,1,143,0.12),transparent_30%),radial-gradient(circle_at_70%_20%,rgba(45,12,98,0.2),transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.98)_0%,rgba(11,2,26,0.95)_50%,rgba(0,0,0,1)_100%)]" />

      <div className="relative mx-auto max-w-7xl px-6 pt-28 pb-16 sm:px-10 lg:px-12 z-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-[#f6a1ff] mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>

        <FavoritesGrid initialComics={favoritedComics} />
      </div>
    </main>
  );
}
