import { favoriteRepository } from "../repositories/favorite.repository";
import { comicRepository } from "../repositories/comic.repository";

export class FavoriteService {
  async addFavorite(userId: number, slug: string) {
    const comic = await comicRepository.findBySlug(slug);
    if (!comic) {
      throw new Error("Comic not found");
    }
    const existing = await favoriteRepository.findByUserAndComic(
      userId,
      comic.id,
    );
    if (existing) {
      return existing;
    }
    return favoriteRepository.create(userId, comic.id);
  }

  async removeFavorite(userId: number, slug: string) {
    const comic = await comicRepository.findBySlug(slug);
    if (!comic) {
      throw new Error("Comic not found");
    }

    const existing = await favoriteRepository.findByUserAndComic(
      userId,
      comic.id,
    );
    if (!existing) {
      throw new Error("Favorite not found");
    }

    await favoriteRepository.delete(userId, comic.id);
  }

  async isFavoriteBySlug(userId: number, slug: string) {
    const comic = await comicRepository.findBySlug(slug);
    if (!comic) {
      throw new Error("Comic not found");
    }

    const fav = await favoriteRepository.findByUserAndComic(userId, comic.id);
    return fav !== null;
  }

  listForUser(userId: number) {
    return favoriteRepository.findByUser(userId);
  }
}

export const favoriteService = new FavoriteService();
