import { z } from "zod";

export const genreSchema = z.object({
  name: z.string().min(1, "Genre name is required").max(50),
});

export type GenreInput = z.infer<typeof genreSchema>;
