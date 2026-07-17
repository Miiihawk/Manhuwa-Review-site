import { userRepository } from "../../../lib/repositories/user.repository";
import { userService } from "../../../lib/services/user.service";
import { updateProfileSchema } from "../../../lib/validators/user.schema";
import { auth } from "../../../lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const userId = Number(id);
  if (!Number.isInteger(userId) || userId < 1) {
    return new Response("Invalid user ID", { status: 400 });
  }

  const user = await userRepository.findById(userId);
  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  return Response.json(user, { status: 200 });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = Number(id);
  if (!Number.isInteger(userId) || userId < 1) {
    return Response.json({ error: "Invalid user ID" }, { status: 400 });
  }

  const session = await auth();
  if (!session?.user || Number(session.user.id) !== userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const user = await userService.updateProfile(userId, parsed.data);
    return Response.json(user, { status: 200 });
  } catch (err) {
    if (err instanceof Error && err.message === "USER_NOT_FOUND") {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    if (err instanceof Error && err.message === "USERNAME_TAKEN") {
      return Response.json(
        { error: "Username is already taken." },
        { status: 409 },
      );
    }
    console.error("PATCH /api/users/[id] failed:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
