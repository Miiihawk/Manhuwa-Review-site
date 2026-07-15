import { prisma } from "../prisma";
import type { NotificationType } from "@prisma-generated";

type NewNotification = {
  userId: number;
  type: NotificationType;
  message: string;
  relatedId?: number;
};

export class NotificationRepository {
  create(data: NewNotification) {
    return prisma.notification.create({ data });
  }

  createMany(rows: NewNotification[]) {
    return prisma.notification.createMany({ data: rows });
  }

  findForUser(userId: number, take = 20) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take,
    });
  }

  countUnread(userId: number) {
    return prisma.notification.count({ where: { userId, isRead: false } });
  }

  markOneRead(userId: number, id: number) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  markAllRead(userId: number) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}

export const notificationRepository = new NotificationRepository();
