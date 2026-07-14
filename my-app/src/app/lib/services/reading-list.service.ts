import { readingListRepository } from "../repositories/reading-list.repository";
import { comicRepository } from "../repositories/comic.repository";
import type { ReadingListInput } from "../validators/reading-list.schema";

export class ReadingListService {
  async setStatus(userId: number, input: ReadingListInput) {
    const comic = await comicRepository.findBySlug(input.slug);
    if (!comic) throw new Error("COMIC_NOT_FOUND");
    return readingListRepository.upsert(userId, comic.id, input.status);
  }

  async removeBySlug(userId: number, slug: string) {
    const comic = await comicRepository.findBySlug(slug);
    if (!comic) throw new Error("COMIC_NOT_FOUND");

    const existing = await readingListRepository.findByUserAndComic(
      userId,
      comic.id,
    );
    if (!existing) return;

    await readingListRepository.delete(userId, comic.id);
  }

  async getStatusBySlug(userId: number, slug: string) {
    const comic = await comicRepository.findBySlug(slug);
    if (!comic) return null;
    const entry = await readingListRepository.findByUserAndComic(
      userId,
      comic.id,
    );
    return entry?.status ?? null;
  }

  listForUser(userId: number) {
    return readingListRepository.findByUser(userId);
  }
}

export const readingListService = new ReadingListService();
