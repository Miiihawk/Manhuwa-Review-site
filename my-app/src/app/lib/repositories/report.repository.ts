import { prisma } from "../prisma";
import type { ReportReason, ReportStatus } from "@prisma-generated";

export class ReportRepository {
  create(data: {
    reporterId: number;
    reason: ReportReason;
    reviewId?: number;
    commentId?: number;
  }) {
    return prisma.report.create({ data });
  }

  findById(id: number) {
    return prisma.report.findUnique({ where: { id } });
  }
  countResolvedBy(userId: number) {
    return prisma.report.count({ where: { resolvedById: userId } });
  }

  findAll() {
    return prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        reporter: { select: { id: true, username: true } },
        review: {
          include: {
            user: { select: { id: true, username: true } },
            comic: { select: { title: true, slug: true } },
          },
        },
        comment: {
          include: {
            user: { select: { id: true, username: true } },
            comic: { select: { title: true, slug: true } },
            review: {
              include: { comic: { select: { title: true, slug: true } } },
            },
          },
        },
      },
    });
  }

  updateStatus(id: number, status: ReportStatus, resolvedById: number) {
    return prisma.report.update({
      where: { id },
      data: { status, resolvedById },
    });
  }

  countPending() {
    return prisma.report.count({ where: { status: "PENDING" } });
  }
}

export const reportRepository = new ReportRepository();
