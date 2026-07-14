import { comicService } from "@/app/lib/services/comic.service";
import { auth } from "@/app/lib/auth";
import { comicSchema } from "@/app/lib/validators/comic.schema";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const comicId = Number(id);

  if (!Number.isInteger(comicId) || comicId <= 0) {
    return Response.json({ error: "Invalid comic id" }, { status: 400 });
  }

  try {
    await comicService.deleteComic(comicId);
    return Response.json({ deleted: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/comics/[id] failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const comicId = Number(id);
  if (!Number.isInteger(comicId) || comicId <= 0) {
    return Response.json({ error: "Invalid comic id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = comicSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const comic = await comicService.updateComic(comicId, parsed.data);
    return Response.json({ id: comic.id, slug: comic.slug }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "COMIC_NOT_FOUND") {
      return Response.json({ error: "Comic not found" }, { status: 404 });
    }
    if (error instanceof Error && error.message === "SLUG_TAKEN") {
      return Response.json(
        { error: "That slug is already taken" },
        { status: 409 },
      );
    }
    console.error("PATCH /api/comics/[id] failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
