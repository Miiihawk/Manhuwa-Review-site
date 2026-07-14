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

  findById(id: number) {
    return prisma.genre.findUnique({
      where: { id },
      include: { _count: { select: { comics: true } } },
    });
  }

  update(id: number, data: { name: string; slug: string }) {
    return prisma.genre.update({ where: { id }, data });
  }

  delete(id: number) {
    return prisma.genre.delete({ where: { id } });
  }
}

export const genreRepository = new GenreRepository();
