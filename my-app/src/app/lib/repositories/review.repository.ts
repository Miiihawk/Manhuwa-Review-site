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

  averageForComic(comicId: number) {
    return prisma.review.aggregate({
      where: { comicId },
      _avg: { rating: true },
    });
  }
}

export const reviewRepository = new ReviewRepository();
