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
}

export const reviewService = new ReviewService();
