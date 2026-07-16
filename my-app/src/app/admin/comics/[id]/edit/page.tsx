import { notFound } from "next/navigation";
import { comicService } from "@/app/lib/services/comic.service";
import EditComicForm from "./EditComicForm";

export const dynamic = "force-dynamic";

export default async function AdminComicEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const comicId = Number(id);

  if (!Number.isInteger(comicId) || comicId <= 0) {
    notFound();
  }

  let comic;
  try {
    comic = await comicService.getComicById(comicId);
  } catch (error) {
    console.error("Edit page: failed to load comic:", error);
    throw error;
  }

  if (!comic) {
    notFound();
  }

  return (
    <EditComicForm
      comic={{
        id: comic.id,
        title: comic.title,
        alternativeName: comic.alternativeName ?? "",
        slug: comic.slug,
        author: comic.author,
        status: comic.publicationStatus,
        category: comic.category?.name ?? "",
        genres: comic.genres.map((g) => g.genre.name),
        coverPhoto: comic.coverPhoto,
        synopsis: comic.synopsis,
        officialLegalPlatforms: comic.sources.map((s) => s.url),
      }}
    />
  );
}
