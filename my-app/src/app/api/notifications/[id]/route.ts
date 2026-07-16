import { notificationService } from "../../../lib/services/notification.service";
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
  const notifId = Number(id);
  if (!Number.isInteger(notifId) || notifId < 1) {
    return Response.json({ error: "Invalid notification id" }, { status: 400 });
  }

  try {
    const userId = Number(session.user.id);
    await notificationService.markOneRead(userId, notifId);
    return Response.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/notifications/[id] failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
