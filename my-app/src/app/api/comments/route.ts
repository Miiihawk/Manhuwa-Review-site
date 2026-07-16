import { createCommentSchema } from "../../lib/validators/comment.schema";
import { commentService } from "../../lib/services/comment.service";
import { auth } from "@/app/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reviewId = Number(searchParams.get("reviewId"));

  if (!Number.isInteger(reviewId) || reviewId < 1) {
    return Response.json(
      { error: "Missing or invalid reviewId" },
      { status: 400 },
    );
  }

  try {
    const comments = await commentService.listByReview(reviewId);
    return Response.json(comments, { status: 200 });
  } catch (error) {
    console.error("GET /api/comments failed:", error);
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

  const parsed = createCommentSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const userId = Number(session.user.id);
    const comment = await commentService.createComment(userId, parsed.data);
    return Response.json(comment, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "PARENT_NOT_FOUND") {
      return Response.json(
        { error: "Parent comment not found" },
        { status: 404 },
      );
    }
    console.error("POST /api/comments failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
