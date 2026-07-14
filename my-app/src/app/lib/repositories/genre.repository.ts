import { prisma } from "../prisma";

export class GenreRepository {
  findBySlug(slug: string) {
    return prisma.genre.findUnique({ where: { slug } });
  }

  create(data: { name: string; slug: string }) {
    return prisma.genre.create({ data });
  }
}

export const genreRepository = new GenreRepository();
