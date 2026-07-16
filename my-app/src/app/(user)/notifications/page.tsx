import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Bell } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { auth } from "@/app/lib/auth";
import { notificationService } from "@/app/lib/services/notification.service";
import NotificationsList from "./NotificationList";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  let notifications: Awaited<
    ReturnType<typeof notificationService.listForUser>
  > = [];
  try {
    notifications = await notificationService.listForUser(
      Number(session.user.id),
    );
  } catch (error) {
    console.error("Notifications page: failed to load:", error);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <Navbar />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,1,143,0.12),transparent_30%),radial-gradient(circle_at_70%_20%,rgba(45,12,98,0.2),transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.98)_0%,rgba(11,2,26,0.95)_50%,rgba(0,0,0,1)_100%)]" />

      <div className="relative mx-auto max-w-3xl px-6 pt-28 pb-16 sm:px-10 lg:px-12 z-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-[#f6a1ff] mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>

        <section className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2.5 mb-1">
            <Bell className="h-5 w-5 text-[#f6a1ff]" />
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#f6a1ff]/90">
              Notifications
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Your Notifications
          </h1>
        </section>

        <div className="mt-6">
          <NotificationsList initial={notifications} />
        </div>
      </div>
    </main>
  );
}
