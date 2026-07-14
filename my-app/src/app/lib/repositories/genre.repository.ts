import { prisma } from "../prisma";

export class GenreRepository {
  findAll() {
    return prisma.genre.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { comics: true } } },
    });
  }

  findBySlug(slug: string) {
    return prisma.genre.findUnique({ where: { slug } });
  }

  create(data: { name: string; slug: string }) {
    return prisma.genre.create({ data });
  }
}

export const genreRepository = new GenreRepository();
