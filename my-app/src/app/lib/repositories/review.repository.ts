import { prisma } from "@/app/lib/prisma";

export class ReviewRepository {
  upsert(
    userId: number,
    comicId: number,
    data: { rating: number; review?: string },
  ) {
    return prisma.review.upsert({
      where: { userId_comicId: { userId, comicId } },
      update: { rating: data.rating, review: data.review },
      create: { userId, comicId, rating: data.rating, review: data.review },
    });
  }

  findByComic(comicId: number) {
    return prisma.review.findMany({
      where: { comicId },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, username: true, profilePic: true } },
      },
    });
  }

  findByUser(userId: number) {
    return prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        comic: {
          select: {
            title: true,
            slug: true,
            coverPhoto: true,
            publicationStatus: true,
          },
        },
      },
    });
  }

  averageForComic(comicId: number) {
    return prisma.review.aggregate({
      where: { comicId },
      _avg: { rating: true },
    });
  }

  findRecent(limit: number) {
    return prisma.review.findMany({
      where: { NOT: { review: null } },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: { select: { username: true, profilePic: true } },
        comic: { select: { title: true, slug: true } },
      },
    });
  }

  findById(id: number) {
    return prisma.review.findUnique({ where: { id } });
  }

  delete(id: number) {
    return prisma.review.delete({ where: { id } });
  }
  count() {
    return prisma.review.count();
  }
}

export const reviewRepository = new ReviewRepository();
