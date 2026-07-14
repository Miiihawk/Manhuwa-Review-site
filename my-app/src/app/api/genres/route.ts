import { genreSchema } from "../../lib/validators/genre.schema";
import { genreService } from "../../lib/services/genre.service";
import { auth } from "@/app/lib/auth";

// Public: the comic form needs the genre list.
export async function GET() {
  try {
    const genres = await genreService.listGenres();
    return Response.json(genres, { status: 200 });
  } catch (error) {
    console.error("GET /api/genres failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// Admin only: create a genre.
export async function POST(req: Request) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = genreSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const genre = await genreService.createGenre(parsed.data.name);
    return Response.json({ id: genre.id, name: genre.name }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "GENRE_EXISTS") {
      return Response.json(
        { error: "That genre already exists" },
        { status: 409 },
      );
    }
    console.error("POST /api/genres failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
