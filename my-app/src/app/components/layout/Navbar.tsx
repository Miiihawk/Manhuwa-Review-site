"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  BookOpen,
  Heart,
  Bell,
  Layers,
  Shield,
  Menu,
  X,
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import SearchForm from "../forms/SearchForm";
import LogoutButton from "./LogoutButton";
import { timeAgo } from "@/app/lib/timeAgo";

type NotificationItem = {
  id: number;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link: string | null;
};

export default function Navbar() {
  const router = useRouter();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return; // logged out / error → leave empty
      const data = await res.json();
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.user?.role === "ADMIN") setIsAdmin(true);
      })
      .catch((error) => console.error("Failed to load session:", error));
    return () => {
      active = false;
    };
  }, []);

  async function markAllRead() {
    try {
      const res = await fetch("/api/notifications", { method: "PATCH" });
      if (!res.ok) return;
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all read:", error);
    }
  }

  async function openNotification(notif: NotificationItem) {
    setIsNotificationsOpen(false);
    if (!notif.isRead) {
      setUnreadCount((c) => Math.max(0, c - 1));
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)),
      );
      fetch(`/api/notifications/${notif.id}`, { method: "PATCH" }).catch(
        (error) => console.error("Failed to mark read:", error),
      );
    }
    if (notif.link) router.push(notif.link);
  }
  return (
    <header className="absolute top-0 left-0 z-50 w-full bg-gradient-to-b from-black/60 via-black/20 to-transparent py-4">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between gap-4 md:hidden">
          <BrandLogo href="/dashboard" className="max-w-[14rem]" compact />

          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-95 md:hidden"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Menu className="h-[1.2rem] w-[1.2rem]" />
            )}
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[#ff018f] px-1 text-[9px] font-black text-white shadow-[0_0_10px_rgba(255,1,143,0.6)]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        </div>

        <div className="hidden items-center justify-between gap-6 md:flex">
          <div className="flex shrink-0 items-center gap-6">
            <BrandLogo href="/dashboard" className="max-w-[14rem]" compact />
          </div>

          <div className="w-full max-w-md md:mx-8">
            <SearchForm />
          </div>

          <nav className="relative flex shrink-0 items-center justify-end gap-1.5 sm:gap-3">
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                title="Admin Dashboard"
                aria-label="Admin Dashboard"
                className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition-all duration-200 hover:bg-white/10 hover:text-[#ff018f] active:scale-95"
              >
                <Shield className="h-[1.15rem] w-[1.15rem]" />
                <span className="pointer-events-none absolute -bottom-9 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#120529]/95 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-[0_10px_24px_rgba(0,0,0,0.45)] transition-opacity duration-200 group-hover:opacity-100">
                  Admin Dashboard
                </span>
              </Link>
            )}
            {/* 1. Series Catalog */}
            <Link
              href="/comicseries"
              title="Series Catalog"
              aria-label="Series Catalog"
              className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition-all duration-200 hover:bg-white/10 hover:text-[#ff018f] active:scale-95"
            >
              <Layers className="h-[1.15rem] w-[1.15rem]" />
              <span className="pointer-events-none absolute -bottom-9 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#120529]/95 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-[0_10px_24px_rgba(0,0,0,0.45)] transition-opacity duration-200 group-hover:opacity-100">
                Series Catalog
              </span>
            </Link>

            {/* 2. Notification Bell Dropdown Controller */}
            <div className="group relative">
              <button
                onClick={() => {
                  const next = !isNotificationsOpen;
                  setIsNotificationsOpen(next);
                  if (next) load();
                }}
                type="button"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-95"
                aria-label="Notifications"
              >
                <Bell className="h-[1.15rem] w-[1.15rem] transition duration-200 group-hover:rotate-12" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[#ff018f] px-1 text-[9px] font-black text-white shadow-[0_0_10px_rgba(255,1,143,0.6)]">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              <span className="pointer-events-none absolute -bottom-9 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#120529]/95 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-[0_10px_24px_rgba(0,0,0,0.45)] transition-opacity duration-200 group-hover:opacity-100">
                Notifications
              </span>

              {/* --- NOTIFICATION POPUP PANEL --- */}
              {isNotificationsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 z-50 w-80 sm:w-96 rounded-2xl border border-white/10 bg-[#120529]/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl animate-in fade-in slide-in-from-top-3 duration-200">
                    <div className="mb-2 flex items-center justify-between border-b border-white/5 pb-2.5">
                      <h3 className="text-sm font-bold tracking-wide text-white">
                        Recent Notifications
                      </h3>
                      {notifications.some((n) => !n.isRead) && (
                        <button
                          onClick={markAllRead}
                          className="text-xs font-semibold text-[#f6a1ff] transition-colors hover:text-white"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-64 space-y-1.5 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="py-6 text-center text-xs text-white/40">
                          You&apos;re all caught up.
                        </p>
                      ) : (
                        notifications.map((notif) => (
                          <button
                            key={notif.id}
                            onClick={() => openNotification(notif)}
                            className={`group block w-full cursor-pointer rounded-xl border p-3 text-left transition-colors ${
                              notif.isRead
                                ? "border-white/5 bg-white/[0.02] hover:bg-white/5"
                                : "border-[#ff018f]/20 bg-[#ff018f]/10 hover:bg-[#ff018f]/15"
                            }`}
                          >
                            <p className="text-xs leading-relaxed text-white/80 group-hover:text-white">
                              {notif.message}
                            </p>
                            <span className="mt-1 block text-[10px] text-white/40">
                              {timeAgo(notif.createdAt)}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                    <div className="mt-2 border-t border-white/5 pt-2 text-center">
                      <Link
                        href="/notifications"
                        onClick={() => setIsNotificationsOpen(false)}
                        className="text-xs font-semibold text-white/50 transition-colors hover:text-[#f6a1ff]"
                      >
                        See all notifications
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* Visual Divider Separator */}
            <div className="mx-1 hidden h-5 w-[1px] bg-white/10 sm:block" />

            {/* 3. Favorites */}
            <Link
              href="/favorites"
              title="Favorites"
              aria-label="Favorites"
              className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition-all duration-200 hover:bg-white/10 hover:text-pink-400 active:scale-95"
            >
              <Heart className="h-[1.15rem] w-[1.15rem]" />
              <span className="pointer-events-none absolute -bottom-9 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#120529]/95 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-[0_10px_24px_rgba(0,0,0,0.45)] transition-opacity duration-200 group-hover:opacity-100">
                Favorites
              </span>
            </Link>

            {/* 4. Reading List */}
            <Link
              href="/reading-list"
              title="Reading List"
              aria-label="Reading List"
              className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-95"
            >
              <BookOpen className="h-[1.15rem] w-[1.15rem]" />
              <span className="pointer-events-none absolute -bottom-9 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#120529]/95 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-[0_10px_24px_rgba(0,0,0,0.45)] transition-opacity duration-200 group-hover:opacity-100">
                Reading List
              </span>
            </Link>

            {/* 5. Profile */}
            <Link
              href="/profile"
              title="Profile"
              aria-label="Profile"
              className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-95"
            >
              <User className="h-[1.15rem] w-[1.15rem]" />
              <span className="pointer-events-none absolute -bottom-9 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#120529]/95 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-[0_10px_24px_rgba(0,0,0,0.45)] transition-opacity duration-200 group-hover:opacity-100">
                Profile
              </span>
            </Link>

            {/* 6. Logout */}
            <LogoutButton />
          </nav>
        </div>

        {isMobileMenuOpen && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-[#120529]/90 p-3 shadow-[0_14px_35px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:hidden">
            <div className="mb-3">
              <SearchForm />
            </div>

            <nav className="grid grid-cols-2 gap-2">
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}

              <Link
                href="/comicseries"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10"
              >
                <Layers className="h-4 w-4" />
                Series
              </Link>

              <Link
                href="/notifications"
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10"
              >
                <Bell className="h-4 w-4" />
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-auto inline-flex min-w-[1.1rem] items-center justify-center rounded-full bg-[#ff018f] px-1 text-[10px] font-black text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              <Link
                href="/favorites"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10"
              >
                <Heart className="h-4 w-4" />
                Favorites
              </Link>

              <Link
                href="/reading-list"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10"
              >
                <BookOpen className="h-4 w-4" />
                Reading List
              </Link>

              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
            </nav>

            <div className="mt-3 border-t border-white/10 pt-3">
              <LogoutButton />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
