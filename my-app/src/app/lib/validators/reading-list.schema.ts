import { z } from "zod";

export const readingListSchema = z.object({
  slug: z.string().min(1),
  status: z.enum([
    "READING",
    "PLAN_TO_READ",
    "COMPLETED",
    "REREADING",
    "PAUSED",
    "DROPPED",
  ]),
});

export type ReadingListInput = z.infer<typeof readingListSchema>;
