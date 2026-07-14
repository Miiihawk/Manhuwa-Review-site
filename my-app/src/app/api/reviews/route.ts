import { reviewSchema } from "../../lib/validators/review.schema";
import { reviewService } from "../../lib/services/review.service";
import { auth } from "@/app/lib/auth";

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

  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const userId = Number(session.user.id);
    const review = await reviewService.submitReview(userId, parsed.data);
    return Response.json(
      { id: review.id, rating: review.rating },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "COMIC_NOT_FOUND") {
      return Response.json({ error: "Comic not found" }, { status: 404 });
    }
    console.error("POST /api/reviews failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return Response.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    const reviews = await reviewService.listReviewsBySlug(slug);
    return Response.json(reviews, { status: 200 });
  } catch (error) {
    console.error("GET /api/reviews failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
