import { updateCommentSchema } from "../../../lib/validators/comment.schema";
import { commentService } from "../../../lib/services/comment.service";
import { auth } from "@/app/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const commentId = Number(id);
  if (!Number.isInteger(commentId) || commentId < 1) {
    return Response.json({ error: "Invalid comment id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateCommentSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const userId = Number(session.user.id);
    const comment = await commentService.updateComment(
      userId,
      commentId,
      parsed.data.content,
    );
    return Response.json(comment, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "COMMENT_NOT_FOUND") {
      return Response.json({ error: "Comment not found" }, { status: 404 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return Response.json({ error: "Not your comment" }, { status: 403 });
    }
    console.error("PATCH /api/comments/[id] failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const commentId = Number(id);
  if (!Number.isInteger(commentId) || commentId < 1) {
    return Response.json({ error: "Invalid comment id" }, { status: 400 });
  }

  try {
    const userId = Number(session.user.id);
    await commentService.deleteComment(userId, commentId);
    return Response.json({ deleted: true }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "COMMENT_NOT_FOUND") {
      return Response.json({ error: "Comment not found" }, { status: 404 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return Response.json({ error: "Not your comment" }, { status: 403 });
    }
    console.error("DELETE /api/comments/[id] failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
