import { prisma } from "../prisma";

export class FavoriteRepository {
  findByUserAndComic(userId: number, comicId: number) {
    return prisma.favorite.findUnique({
      where: { userId_comicId: { userId, comicId } },
    });
  }

  create(userId: number, comicId: number) {
    return prisma.favorite.create({ data: { userId, comicId } });
  }

  delete(userId: number, comicId: number) {
    return prisma.favorite.delete({
      where: { userId_comicId: { userId, comicId } },
    });
  }

  findByUser(userId: number) {
    return prisma.favorite.findMany({
      where: { userId },
      include: { comic: true },
    });
  }

  countByUser(userId: number) {
    return prisma.favorite.count({ where: { userId } });
  }
}

export const favoriteRepository = new FavoriteRepository();
