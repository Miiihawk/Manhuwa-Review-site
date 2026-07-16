import { adminUpdateUserSchema } from "@/app/lib/validators/user.schema";
import { userService } from "@/app/lib/services/user.service";
import { auth } from "@/app/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const userId = Number(id);
  if (!Number.isInteger(userId) || userId < 1) {
    return Response.json({ error: "Invalid user id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = adminUpdateUserSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const actorId = Number(session.user.id);
    const user = await userService.adminUpdateUser(
      actorId,
      userId,
      parsed.data,
    );
    return Response.json(
      { id: user.id, role: user.role, isActive: user.isActive },
      { status: 200 },
    );
  } catch (err) {
    if (err instanceof Error && err.message === "USER_NOT_FOUND") {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    if (err instanceof Error && err.message === "CANNOT_DEMOTE_SELF") {
      return Response.json(
        { error: "You can't remove your own admin role." },
        { status: 400 },
      );
    }
    if (err instanceof Error && err.message === "CANNOT_DEACTIVATE_SELF") {
      return Response.json(
        { error: "You can't deactivate your own account." },
        { status: 400 },
      );
    }
    if (err instanceof Error && err.message === "LAST_ADMIN") {
      return Response.json(
        { error: "There must be at least one admin." },
        { status: 400 },
      );
    }
    console.error("PATCH /api/admin/users/[id] failed:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const userId = Number(id);
  if (!Number.isInteger(userId) || userId < 1) {
    return Response.json({ error: "Invalid user id" }, { status: 400 });
  }

  try {
    const actorId = Number(session.user.id);
    await userService.adminDeleteUser(actorId, userId);
    return Response.json({ deleted: true }, { status: 200 });
  } catch (err) {
    if (err instanceof Error && err.message === "USER_NOT_FOUND") {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    if (err instanceof Error && err.message === "CANNOT_DELETE_SELF") {
      return Response.json(
        { error: "You can't delete your own account." },
        { status: 400 },
      );
    }
    if (err instanceof Error && err.message === "LAST_ADMIN") {
      return Response.json(
        { error: "You can't delete the last admin." },
        { status: 400 },
      );
    }
    console.error("DELETE /api/admin/users/[id] failed:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
