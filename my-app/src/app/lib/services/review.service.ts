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
  }
}
