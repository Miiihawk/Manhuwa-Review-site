import { prisma } from "../prisma";

export class ComicRepository {
  //read
  findAll() {
    return prisma.comic.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  findBySlug(slug: string) {
    return prisma.comic.findUnique({
      where: { slug },
    });
  }

  findAllSlugs() {
    return prisma.comic.findMany({
      select: { slug: true },
    });
  }

  count() {
    return prisma.comic.count();
  }

  findRecentlyAdded(take = 6) {
    return prisma.comic.findMany({
      orderBy: { createdAt: "desc" },
      take,
    });
  }

  findHighestRated(take = 6) {
    return prisma.comic.findMany({
      orderBy: { averageRating: { sort: "desc", nulls: "last" } },
      take,
    });
  }
  //Create

  create(data: {
    title: string;
    slug: string;
    synopsis: string;
    coverPhoto: string;
    author: string;
    categoryId: number;
    createdById: number;
  }) {
    return prisma.comic.create({ data });
  }

  //Update
  updateAverageRating(comicId: number, averageRating: number | null) {
    return prisma.comic.update({
      where: { id: comicId },
      data: { averageRating },
    });
  }
}

export const comicRepository = new ComicRepository();
