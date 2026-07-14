import { comicSchema } from "../../lib/validators/comic.schema";
import { comicService } from "../../lib/services/comic.service";
import { auth } from "@/app/lib/auth";

export async function POST(req: Request) {
  // Admin only.
  const session = await auth();
  // Ensure session and user exist and that the user is an admin.
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
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
    const createdById = Number((session.user as any).id);
    const comic = await comicService.createComic(createdById, parsed.data);
    return Response.json({ id: comic.id, slug: comic.slug }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "SLUG_TAKEN") {
      return Response.json(
        { error: "That slug is already taken" },
        { status: 409 },
      );
    }
    console.error("POST /api/comics failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
