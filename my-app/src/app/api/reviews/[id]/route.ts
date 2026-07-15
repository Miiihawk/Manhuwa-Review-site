import { reviewService } from "../../../lib/services/review.service";
import { auth } from "@/app/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const reviewId = Number(id);
  if (!Number.isInteger(reviewId) || reviewId < 1) {
    return Response.json({ error: "Invalid review id" }, { status: 400 });
  }

  try {
    const userId = Number(session.user.id);
    await reviewService.deleteReview(userId, reviewId);
    return Response.json({ deleted: true }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "REVIEW_NOT_FOUND") {
      return Response.json({ error: "Review not found" }, { status: 404 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return Response.json({ error: "Not your review" }, { status: 403 });
    }
    console.error("DELETE /api/reviews/[id] failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
