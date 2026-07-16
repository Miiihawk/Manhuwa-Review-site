import { z } from "zod";

export const reportReasons = [
  "SPAM",
  "HARASSMENT",
  "HATE_SPEECH",
  "INAPPROPRIATE_CONTENT",
  "MISINFORMATION",
  "COPYRIGHT_VIOLATION",
  "OTHER",
] as const;

export const createReportSchema = z
  .object({
    reason: z.enum(reportReasons),
    reviewId: z.number().int().positive().optional(),
    commentId: z.number().int().positive().optional(),
  })
  .refine((d) => (d.reviewId ? 1 : 0) + (d.commentId ? 1 : 0) === 1, {
    message: "A report must target exactly one of a review or a comment",
    path: ["reviewId"],
  });

export const resolveReportSchema = z.object({
  action: z.enum(["dismiss", "remove"]),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type ResolveReportInput = z.infer<typeof resolveReportSchema>;
