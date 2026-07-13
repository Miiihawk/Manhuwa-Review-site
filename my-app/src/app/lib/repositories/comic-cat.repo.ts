import { prisma } from "../prisma";

export class ComicCategoryRepository {
  findBySlug(slug: string) {
    return prisma.comicCategory.findUnique({ where: { slug } });
  }

  create(data: { name: string; slug: string }) {
    return prisma.comicCategory.create({ data });
  }
}

export const comicCategoryRepository = new ComicCategoryRepository();
