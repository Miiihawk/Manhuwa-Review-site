"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { timeAgo } from "@/app/lib/timeAgo";

export type NotificationItem = {
  id: number;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string | Date;
  link: string | null;
};

export default function NotificationsList({
  initial,
}: {
  initial: NotificationItem[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>(initial);

  const hasUnread = items.some((n) => !n.isRead);

  async function markAllRead() {
    try {
      const res = await fetch("/api/notifications", { method: "PATCH" });
      if (!res.ok) return;
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all read:", error);
    }
  }

  async function open(notif: NotificationItem) {
    if (!notif.isRead) {
      setItems((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)),
      );
      fetch(`/api/notifications/${notif.id}`, { method: "PATCH" }).catch(
        (error) => console.error("Failed to mark read:", error),
      );
    }
    if (notif.link) router.push(notif.link);
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
        <p className="text-sm text-white/40">You have no notifications yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {hasUnread && (
        <div className="flex justify-end">
          <button
            onClick={markAllRead}
            className="text-xs font-semibold text-[#f6a1ff] hover:text-white transition-colors"
          >
            Mark all as read
          </button>
        </div>
      )}

      {items.map((notif) => (
        <button
          key={notif.id}
          onClick={() => open(notif)}
          className={`group block w-full text-left rounded-2xl border p-4 transition-colors ${
            notif.isRead
              ? "border-white/5 bg-white/[0.02] hover:bg-white/5"
              : "border-[#ff018f]/20 bg-[#ff018f]/10 hover:bg-[#ff018f]/15"
          }`}
        >
          <div className="flex items-start gap-3">
            {!notif.isRead && (
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#ff018f]" />
            )}
            <div className={notif.isRead ? "pl-5" : ""}>
              <p className="text-sm text-white/85 group-hover:text-white">
                {notif.message}
              </p>
              <span className="mt-1 block text-[11px] text-white/40">
                {timeAgo(notif.createdAt)}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
