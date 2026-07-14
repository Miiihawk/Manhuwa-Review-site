import { prisma } from "../prisma";
import type { ReadingListStatus } from "@prisma-generated";

export class ReadingListRepository {
  findByUserAndComic(userId: number, comicId: number) {
    return prisma.readingList.findUnique({
      where: { userId_comicId: { userId, comicId } },
    });
  }

  upsert(userId: number, comicId: number, status: ReadingListStatus) {
    return prisma.readingList.upsert({
      where: { userId_comicId: { userId, comicId } },
      update: { status },
      create: { userId, comicId, status },
    });
  }

  delete(userId: number, comicId: number) {
    return prisma.readingList.delete({
      where: { userId_comicId: { userId, comicId } },
    });
  }

  findByUser(userId: number) {
    return prisma.readingList.findMany({
      where: { userId },
      include: { comic: true },
      orderBy: { updatedAt: "desc" },
    });
  }
}

export const readingListRepository = new ReadingListRepository();
