import { genreRepository } from "../repositories/genre.repository";
import { slugify } from "../slug";

export class GenreService {
  listGenres() {
    return genreRepository.findAll();
  }

  async createGenre(name: string) {
    const slug = slugify(name);

    const existing = await genreRepository.findBySlug(slug);
    if (existing) {
      throw new Error("GENRE_EXISTS");
    }

    return genreRepository.create({ name: name.trim(), slug });
  }

  async updateGenre(id: number, name: string) {
    const existing = await genreRepository.findById(id);
    if (!existing) {
      throw new Error("GENRE_NOT_FOUND");
    }

    const slug = slugify(name);

    // Another genre must not already own this slug (itself is fine).
    const bySlug = await genreRepository.findBySlug(slug);
    if (bySlug && bySlug.id !== id) {
      throw new Error("GENRE_EXISTS");
    }

    return genreRepository.update(id, { name: name.trim(), slug });
  }

  async deleteGenre(id: number) {
    const existing = await genreRepository.findById(id);
    if (!existing) {
      throw new Error("GENRE_NOT_FOUND");
    }

    // Guard: don't delete a genre that comics still use.
    if (existing._count.comics > 0) {
      throw new Error("GENRE_IN_USE");
    }

    return genreRepository.delete(id);
  }
}

export const genreService = new GenreService();
