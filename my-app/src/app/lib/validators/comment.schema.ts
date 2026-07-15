import { z } from "zod";

export const createCommentSchema = z
  .object({
    content: z.string().min(1, "Comment can't be empty").max(2000),
    reviewId: z.number().int().positive().optional(),
    comicId: z.number().int().positive().optional(),
    parentId: z.number().int().positive().optional(),
  })
  .refine((d) => (d.reviewId ? 1 : 0) + (d.comicId ? 1 : 0) === 1, {
    message: "A comment must target exactly one of a review or a comic",
    path: ["reviewId"],
  });

export const updateCommentSchema = z.object({
  content: z.string().min(1, "Comment can't be empty").max(2000),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
