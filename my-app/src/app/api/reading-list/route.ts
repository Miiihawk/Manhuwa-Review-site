import { z } from "zod";
import { readingListSchema } from "../../lib/validators/reading-list.schema";
import { readingListService } from "../../lib/services/reading-list.service";
import { auth } from "@/app/lib/auth";

const deleteSchema = z.object({ slug: z.string().min(1) });

export async function GET(req: Request) {
  const session = await auth();
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return Response.json({ error: "Missing slug" }, { status: 400 });
  }
  if (!session?.user) {
    return Response.json({ status: null }, { status: 200 });
  }

  try {
    const userId = Number(session.user.id);
    const status = await readingListService.getStatusBySlug(userId, slug);
    return Response.json({ status }, { status: 200 });
  } catch (error) {
    console.error("GET /api/reading-list failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = readingListSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const userId = Number(session.user.id);
    await readingListService.setStatus(userId, parsed.data);
    return Response.json({ status: parsed.data.status }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "COMIC_NOT_FOUND") {
      return Response.json({ error: "Comic not found" }, { status: 404 });
    }
    console.error("POST /api/reading-list failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const userId = Number(session.user.id);
    await readingListService.removeBySlug(userId, parsed.data.slug);
    return Response.json({ status: null }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "COMIC_NOT_FOUND") {
      return Response.json({ error: "Comic not found" }, { status: 404 });
    }
    console.error("DELETE /api/reading-list failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
