import { reviewRepository } from "../repositories/review.repository";
import { comicRepository } from "../repositories/comic.repository";
import type { ReviewInput } from "../validators/review.schema";

export class ReviewService {
  async submitReview(userId: number, input: ReviewInput) {
    const comic = await comicRepository.findBySlug(input.slug);
    if (!comic) {
      throw new Error("Comic not found");
    }

    const review = await reviewRepository.upsert(userId, comic.id, {
      rating: input.rating,
      review: input.review,
    });

    await this.recalcAverage(comic.id);

    return review;
  }

  async recalcAverage(comicId: number) {
    const result = await reviewRepository.averageForComic(comicId);
    const avg = result._avg.rating;
    const rounded = avg === null ? null : Math.round(avg);
    await comicRepository.updateAverageRating(comicId, rounded);
  }

  listReviews(comicId: number) {
    return reviewRepository.findByComic(comicId);
  }

  listForUser(userId: number) {
    return reviewRepository.findByUser(userId);
  }

  async listReviewsBySlug(slug: string) {
    const comic = await comicRepository.findBySlug(slug);
    if (!comic) return [];
    return reviewRepository.findByComic(comic.id);
  }

  listRecentReviews(limit = 3) {
    return reviewRepository.findRecent(limit);
  }

  async deleteReview(userId: number, reviewId: number) {
    const existing = await reviewRepository.findById(reviewId);
    if (!existing) throw new Error("REVIEW_NOT_FOUND");
    if (existing.userId !== userId) throw new Error("FORBIDDEN");

    const comicId = existing.comicId;
    await reviewRepository.delete(reviewId);
    await this.recalcAverage(comicId);
    return { deleted: true };
  }
  countReviews() {
    return reviewRepository.count();
  }
}

export const reviewService = new ReviewService();
