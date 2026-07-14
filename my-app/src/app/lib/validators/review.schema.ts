import { z } from "zod";

export const reviewSchema = z.object({
  slug: z.string().min(1),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be 1-5")
    .max(5, "Rating must be 1-5"),
  review: z.string().max(2000).optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
