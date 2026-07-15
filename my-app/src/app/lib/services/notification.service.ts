import { notificationRepository } from "../repositories/notification.repository";
import { comicRepository } from "../repositories/comic.repository";
import type { ComicStatus } from "@prisma-generated";

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export class NotificationService {
  async listForUser(userId: number) {
    const rows = await notificationRepository.findForUser(userId);

    const comicIds = [
      ...new Set(
        rows.map((r) => r.relatedId).filter((v): v is number => v != null),
      ),
    ];
    const comics = comicIds.length
      ? await comicRepository.findSlugsByIds(comicIds)
      : [];
    const slugById = new Map(comics.map((c) => [c.id, c.slug]));

    return rows.map((r) => ({
      id: r.id,
      type: r.type,
      message: r.message,
      isRead: r.isRead,
      createdAt: r.createdAt,
      link:
        r.relatedId != null && slugById.has(r.relatedId)
          ? `/comic/${slugById.get(r.relatedId)}`
          : null,
    }));
  }

  countUnread(userId: number) {
    return notificationRepository.countUnread(userId);
  }

  markOneRead(userId: number, id: number) {
    return notificationRepository.markOneRead(userId, id);
  }

  markAllRead(userId: number) {
    return notificationRepository.markAllRead(userId);
  }

  async notifyCommentReply(params: {
    recipientId: number;
    actorUsername: string;
    comicId?: number;
    isReply: boolean;
  }) {
    const message = params.isReply
      ? `${params.actorUsername} replied to your comment.`
      : `${params.actorUsername} commented on your review.`;

    await notificationRepository.create({
      userId: params.recipientId,
      type: "NEW_COMMENT_REPLY",
      message,
      relatedId: params.comicId,
    });
  }

  async notifyComicStatusChange(params: {
    comicId: number;
    comicTitle: string;
    newStatus: ComicStatus;
    recipientIds: number[];
  }) {
    if (params.recipientIds.length === 0) return;

    await notificationRepository.createMany(
      params.recipientIds.map((userId) => ({
        userId,
        type: "COMIC_STATUS_CHANGE" as const,
        message: `${params.comicTitle} was updated to ${formatStatus(
          params.newStatus,
        )}.`,
        relatedId: params.comicId,
      })),
    );
  }
}

export const notificationService = new NotificationService();
