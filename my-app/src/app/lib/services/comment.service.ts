import { commentRepository } from "../repositories/comment.repository";
import { reviewRepository } from "../repositories/review.repository";
import { userRepository } from "../repositories/user.repository";
import { notificationService } from "./notification.service";
import type { CreateCommentInput } from "../validators/comment.schema";

export class CommentService {
  listByReview(reviewId: number) {
    return commentRepository.findByReview(reviewId);
  }

  async createComment(userId: number, input: CreateCommentInput) {
    let parentId: number | undefined = input.parentId;
    let parent: {
      userId: number;
      comicId: number | null;
      reviewId: number | null;
      parentId: number | null;
      id: number;
    } | null = null;

    if (parentId) {
      parent = await commentRepository.findById(parentId);
      if (!parent) throw new Error("PARENT_NOT_FOUND");
      parentId = parent.parentId ?? parent.id;
    }

    const comment = await commentRepository.create({
      content: input.content,
      userId,
      reviewId: input.reviewId,
      comicId: input.comicId,
      parentId,
    });

    // Best-effort — never fail the comment if notifying throws.
    try {
      await this.notifyForComment(userId, input, parent);
    } catch (error) {
      console.error("Comment notification failed:", error);
    }

    return comment;
  }

  private async notifyForComment(
    actorId: number,
    input: CreateCommentInput,
    parent: {
      userId: number;
      comicId: number | null;
      reviewId: number | null;
    } | null,
  ) {
    let recipientId: number | null = null;
    let comicId: number | null = input.comicId ?? null;
    const isReply = parent !== null;

    if (parent) {
      recipientId = parent.userId;
      comicId = comicId ?? parent.comicId;
      if (comicId == null && parent.reviewId != null) {
        const review = await reviewRepository.findById(parent.reviewId);
        comicId = review?.comicId ?? null;
      }
    } else if (input.reviewId) {
      const review = await reviewRepository.findById(input.reviewId);
      if (review) {
        recipientId = review.userId;
        comicId = review.comicId;
      }
    }

    // Don't notify yourself.
    if (recipientId === null || recipientId === actorId) return;

    const actor = await userRepository.findById(actorId);
    await notificationService.notifyCommentReply({
      recipientId,
      actorUsername: actor?.username ?? "Someone",
      comicId: comicId ?? undefined,
      isReply,
    });
  }

  async updateComment(userId: number, id: number, content: string) {
    const existing = await commentRepository.findById(id);
    if (!existing) throw new Error("COMMENT_NOT_FOUND");
    if (existing.userId !== userId) throw new Error("FORBIDDEN");
    return commentRepository.update(id, content);
  }

  async deleteComment(userId: number, id: number) {
    const existing = await commentRepository.findById(id);
    if (!existing) throw new Error("COMMENT_NOT_FOUND");
    if (existing.userId !== userId) throw new Error("FORBIDDEN");
    return commentRepository.delete(id);
  }
}

export const commentService = new CommentService();
