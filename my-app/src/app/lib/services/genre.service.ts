import { genreRepository } from "../repositories/genre.repository";

export class GenreService {
  listGenres() {
    return genreRepository.findAll();
  }

  async createGenre(name: string) {
    const slug = name.trim().toLowerCase().replace(/\s+/g, "-");

    const existing = await genreRepository.findBySlug(slug);
    if (existing) {
      throw new Error("GENRE_EXISTS");
    }

    return genreRepository.create({ name: name.trim(), slug });
  }
}

export const genreService = new GenreService();
