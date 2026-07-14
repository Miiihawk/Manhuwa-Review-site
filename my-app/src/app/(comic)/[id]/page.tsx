import { notFound } from "next/navigation";
import { comicService } from "@/app/lib/services/comic.service";
import ComicDetail from "./ComicDetail";

export type TabType = "synopsis" | "reviews" | "sources";

// SSG: pre-render a static page for every comic slug at build time.
export async function generateStaticParams() {
  try {
    const slugs = await comicService.listComicSlugs();
    return slugs.map((comic) => ({ id: comic.slug }));
  } catch (error) {
    console.error("generateStaticParams failed:", error);
    return [];
  }
}

export default async function ComicDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let comic;
  try {
    comic = await comicService.getComicBySlug(id);
  } catch (error) {
    console.error("Comic page: failed to load comic:", error);
    throw error; // let Next's error boundary handle a real DB failure
  }

  if (!comic) {
    notFound();
  }

  return <ComicDetail comic={comic} slug={id} />;
}
