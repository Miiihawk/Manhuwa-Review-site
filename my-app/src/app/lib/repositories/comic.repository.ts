import { prisma } from "../prisma";
import type { ComicStatus } from "@prisma-generated";

export class ComicRepository {
  //read
  findAll() {
    return prisma.comic.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
  }

  findBySlug(slug: string) {
    return prisma.comic.findUnique({
      where: { slug },
      include: {
        category: true,
        genres: { include: { genre: true } },
        _count: { select: { reviews: true, favorites: true } },
      },
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

  findForDirectory(
    filters: {
      status?: ComicStatus;
      categorySlug?: string;
      genreSlug?: string;
    },
    sort: "rating" | "reviews" | "recent" | "title",
  ) {
    const orderBy =
      sort === "reviews"
        ? { reviews: { _count: "desc" as const } }
        : sort === "recent"
          ? { createdAt: "desc" as const }
          : sort === "title"
            ? { title: "asc" as const }
            : {
                averageRating: {
                  sort: "desc" as const,
                  nulls: "last" as const,
                },
              };

    return prisma.comic.findMany({
      where: {
        ...(filters.status ? { publicationStatus: filters.status } : {}),
        ...(filters.categorySlug
          ? { category: { slug: filters.categorySlug } }
          : {}),
        ...(filters.genreSlug
          ? { genres: { some: { genre: { slug: filters.genreSlug } } } }
          : {}),
      },
      orderBy,
      include: {
        category: true,
        _count: { select: { reviews: true } },
      },
    });
  }

  findById(id: number) {
    return prisma.comic.findUnique({
      where: { id },
      include: {
        category: true,
        genres: { include: { genre: true } },
      },
    });
  }

  findSlugsByIds(ids: number[]) {
    return prisma.comic.findMany({
      where: { id: { in: ids } },
      select: { id: true, slug: true },
    });
  }
  //Create

  create(data: {
    title: string;
    alternativeName?: string | null;
    slug: string;
    synopsis: string;
    coverPhoto: string;
    author: string;
    categoryId: number;
    createdById: number;
    publicationStatus?: ComicStatus;
    genreIds?: number[];
  }) {
    const { genreIds, ...comicData } = data;

    return prisma.comic.create({
      data: {
        ...comicData,
        genres:
          genreIds && genreIds.length > 0
            ? { create: genreIds.map((genreId) => ({ genreId })) }
            : undefined,
      },
    });
  }

  //Update
  updateAverageRating(comicId: number, averageRating: number | null) {
    return prisma.comic.update({
      where: { id: comicId },
      data: { averageRating },
    });
  }

  //Delete
  delete(id: number) {
    return prisma.comic.delete({ where: { id } });
  }

  //Update

  update(
    id: number,
    data: {
      title: string;
      alternativeName?: string | null;
      slug: string;
      synopsis: string;
      coverPhoto: string;
      author: string;
      categoryId: number;
      publicationStatus?: ComicStatus;
      genreIds?: number[];
    },
  ) {
    const { genreIds, ...comicData } = data;

    return prisma.comic.update({
      where: { id },
      data: {
        ...comicData,
        genres: genreIds
          ? {
              deleteMany: {},
              create: genreIds.map((genreId) => ({ genreId })),
            }
          : undefined,
      },
    });
  }
}

export const comicRepository = new ComicRepository();
