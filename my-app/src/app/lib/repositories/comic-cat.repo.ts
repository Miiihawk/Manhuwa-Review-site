import { prisma } from "../prisma";

export class ComicCategoryRepository {
  findBySlug(slug: string) {
    return prisma.comicCategory.findUnique({ where: { slug } });
  }

  findById(id: number) {
    return prisma.comicCategory.findUnique({
      where: { id },
      include: { _count: { select: { comics: true } } },
    });
  }

  findAll() {
    return prisma.comicCategory.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { comics: true } } },
    });
  }

  create(data: { name: string; slug: string }) {
    return prisma.comicCategory.create({ data });
  }

  update(id: number, data: { name: string; slug: string }) {
    return prisma.comicCategory.update({ where: { id }, data });
  }

  delete(id: number) {
    return prisma.comicCategory.delete({ where: { id } });
  }
}

export const comicCategoryRepository = new ComicCategoryRepository();
