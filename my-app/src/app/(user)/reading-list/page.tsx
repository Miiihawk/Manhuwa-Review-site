import { auth } from "@/app/lib/auth";
import { readingListService } from "@/app/lib/services/reading-list.service";
import ReadingListView from "./ReadingListView";

export const dynamic = "force-dynamic";

export type ListEntry = {
  slug: string;
  title: string;
  image: string;
  tag: string;
  description: string;
  status: string;
};

export default async function ReadingListPage() {
  let entries: ListEntry[] = [];

  try {
    const session = await auth();
    if (session?.user) {
      const rows = await readingListService.listForUser(
        Number(session.user.id),
      );
      entries = rows.map((row) => ({
        slug: row.comic.slug,
        title: row.comic.title,
        image: row.comic.coverPhoto,
        tag: row.comic.publicationStatus,
        description: row.comic.synopsis,
        status: row.status,
      }));
    }
  } catch (error) {
    console.error("Reading list page: failed to load:", error);
  }

  return <ReadingListView entries={entries} />;
}
