import { prisma } from "../prisma";

export class CommentRepository {
  findByReview(reviewId: number) {
    return prisma.comment.findMany({
      where: { reviewId, parentId: null },
      orderBy: { createdAt: "asc" },
      include: {
        user: { select: { id: true, username: true, profilePic: true } },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            user: { select: { id: true, username: true, profilePic: true } },
          },
        },
      },
    });
  }

  findById(id: number) {
    return prisma.comment.findUnique({ where: { id } });
  }

  create(data: {
    content: string;
    userId: number;
    reviewId?: number;
    comicId?: number;
    parentId?: number;
  }) {
    return prisma.comment.create({ data });
  }

  update(id: number, content: string) {
    return prisma.comment.update({ where: { id }, data: { content } });
  }

  delete(id: number) {
    return prisma.comment.delete({ where: { id } });
  }
}

export const commentRepository = new CommentRepository();
