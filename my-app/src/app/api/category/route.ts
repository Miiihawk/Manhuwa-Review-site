import { categorySchema } from "../../lib/validators/category.schema";
import { categoryService } from "../../lib/services/category.service";
import { auth } from "@/app/lib/auth";

// Public: the comic form needs the category list.
export async function GET() {
  try {
    const categories = await categoryService.listCategories();
    return Response.json(categories, { status: 200 });
  } catch (error) {
    console.error("GET /api/categories failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// Admin only: create a category.
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

  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const category = await categoryService.createCategory(parsed.data.name);
    return Response.json(
      { id: category.id, name: category.name },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "CATEGORY_EXISTS") {
      return Response.json(
        { error: "That category already exists" },
        { status: 409 },
      );
    }
    console.error("POST /api/categories failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
