import { categorySchema } from "@/app/lib/validators/category.schema";
import { categoryService } from "@/app/lib/services/category.service";
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
  const categoryId = Number(id);
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return Response.json({ error: "Invalid category id" }, { status: 400 });
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
    const category = await categoryService.updateCategory(
      categoryId,
      parsed.data.name,
    );
    return Response.json(
      { id: category.id, name: category.name },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "CATEGORY_NOT_FOUND") {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }
    if (error instanceof Error && error.message === "CATEGORY_EXISTS") {
      return Response.json(
        { error: "That category already exists" },
        { status: 409 },
      );
    }
    console.error("PATCH /api/categories/[id] failed:", error);
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
  const categoryId = Number(id);
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return Response.json({ error: "Invalid category id" }, { status: 400 });
  }

  try {
    await categoryService.deleteCategory(categoryId);
    return Response.json({ deleted: true }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "CATEGORY_NOT_FOUND") {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }
    if (error instanceof Error && error.message === "CATEGORY_IN_USE") {
      return Response.json(
        { error: "This category is used by comics — reassign them first." },
        { status: 409 },
      );
    }
    console.error("DELETE /api/categories/[id] failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
