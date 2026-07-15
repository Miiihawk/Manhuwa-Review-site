import { notificationService } from "../../lib/services/notification.service";
import { auth } from "@/app/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = Number(session.user.id);
    const [notifications, unreadCount] = await Promise.all([
      notificationService.listForUser(userId),
      notificationService.countUnread(userId),
    ]);
    return Response.json({ notifications, unreadCount }, { status: 200 });
  } catch (error) {
    console.error("GET /api/notifications failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = Number(session.user.id);
    await notificationService.markAllRead(userId);
    return Response.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/notifications failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
