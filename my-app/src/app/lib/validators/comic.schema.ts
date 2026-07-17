import { z } from "zod";
import { ComicStatus } from "@prisma-enums";

export const comicSchema = z.object({
  title: z.string().min(1, "Title is required"),
  alternativeName: z.string().optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  synopsis: z.string().min(1, "Synopsis is required"),
  coverPhoto: z.string().min(1, "Cover photo is required"),
  author: z.string().min(1, "Author is required"),
  genres: z.array(z.string()).min(1, "Pick at least one genre"),
  category: z.string().min(1, "Category is required"),
  officialLegalPlatforms: z.array(z.string()).max(4).optional(),
  // Accepts every value in the schema's ComicStatus enum — stays in sync automatically.
  publicationStatus: z.enum(ComicStatus),
});

export type ComicInput = z.infer<typeof comicSchema>;
