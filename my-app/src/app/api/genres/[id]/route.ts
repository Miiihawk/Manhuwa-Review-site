import { genreSchema } from "@/app/lib/validators/genre.schema";
import { genreService } from "@/app/lib/services/genre.service";
import { auth } from "@/app/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const genreId = Number(id);
  if (!Number.isInteger(genreId) || genreId <= 0) {
    return Response.json({ error: "Invalid genre id" }, { status: 400 });
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
    const genre = await genreService.updateGenre(genreId, parsed.data.name);
    return Response.json({ id: genre.id, name: genre.name }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "GENRE_NOT_FOUND") {
      return Response.json({ error: "Genre not found" }, { status: 404 });
    }
    if (error instanceof Error && error.message === "GENRE_EXISTS") {
      return Response.json(
        { error: "That genre already exists" },
        { status: 409 },
      );
    }
    console.error("PATCH /api/genres/[id] failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const genreId = Number(id);
  if (!Number.isInteger(genreId) || genreId <= 0) {
    return Response.json({ error: "Invalid genre id" }, { status: 400 });
  }

  try {
    await genreService.deleteGenre(genreId);
    return Response.json({ deleted: true }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "GENRE_NOT_FOUND") {
      return Response.json({ error: "Genre not found" }, { status: 404 });
    }
    if (error instanceof Error && error.message === "GENRE_IN_USE") {
      return Response.json(
        { error: "This genre is used by comics — remove it from them first." },
        { status: 409 },
      );
    }
    console.error("DELETE /api/genres/[id] failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
