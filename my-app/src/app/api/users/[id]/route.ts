import { userRepository } from "../../../lib/repositories/user.repository";

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
