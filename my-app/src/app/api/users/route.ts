import { registerSchema } from "../../lib/validators/user.schema";
import { userService } from "../../lib/services/user.service";
import { userRepository } from "../../lib/repositories/user.repository";

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch (error) {
    return new Response("Invalid JSON", { status: 400 });
  }

  //validate
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }, //input failed
    );
  }

  try {
    const user = await userService.registerUser(parsed.data);
    return Response.json(
      { id: user.id, username: user.username },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof Error && err.message === "email already exists") {
      return Response.json({ error: "Email already in use" }, { status: 409 });
    }
    if (err instanceof Error && err.message === "Username already taken") {
      return Response.json(
        { error: "Username already taken" },
        { status: 409 },
      );
    }
    console.error("POST /api/users failed:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET() {
  const users = await userRepository.findMany();
  return Response.json(users, { status: 200 });
}
