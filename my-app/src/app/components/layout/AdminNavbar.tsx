"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  Folder,
  LogOut,
  MessageSquare,
  Tag,
  User,
  Users,
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import LogoutButton from "./LogoutButton";

const mockNotifications = [
  {
    id: 1,
    text: "New comic submissions are waiting for review.",
    time: "1h ago",
  },
  {
    id: 2,
    text: "A featured title was updated by the editorial team.",
    time: "Today",
  },
  {
    id: 3,
    text: "Another admin left a note on the moderation queue.",
    time: "Today",
  },
];

const adminShortcuts = [
  { href: "/admin/comics", label: "Comic Management", icon: BookOpen },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin/reviews", label: "Review Management", icon: MessageSquare },
  { href: "/admin/genres", label: "Genre Management", icon: Tag },
  { href: "/admin/categories", label: "Category Management", icon: Folder },
];

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 z-50 w-full bg-gradient-to-b from-black/70 via-black/25 to-transparent py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 sm:px-10 lg:px-12">
        <BrandLogo href="/admin/dashboard" className="max-w-[14rem]" compact />

        <nav className="relative flex shrink-0 items-center gap-1.5 sm:gap-3">
          <div className="hidden items-center gap-1.5 md:flex">
            {adminShortcuts.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                title={label}
                aria-label={label}
                className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-95"
              >
                <Icon className="h-4 w-4" />
                <span className="pointer-events-none absolute -bottom-9 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#120529]/95 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-[0_10px_24px_rgba(0,0,0,0.45)] transition-opacity duration-200 group-hover:opacity-100">
                  {label}
                </span>
              </Link>
            ))}
          </div>

          <div
            className="hidden h-6 w-px bg-white/20 md:block"
            aria-hidden="true"
          />

          <div className="group relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-95"
              aria-label="Notifications"
            >
              <Bell className="h-[1.15rem] w-[1.15rem] transition duration-200 group-hover:rotate-12" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[#ff018f] px-1 text-[9px] font-black text-white shadow-[0_0_10px_rgba(255,1,143,0.6)]">
                3
              </span>
            </button>

            <span className="pointer-events-none absolute -bottom-9 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#120529]/95 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-[0_10px_24px_rgba(0,0,0,0.45)] transition-opacity duration-200 group-hover:opacity-100">
              Notifications
            </span>

            {isOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsOpen(false)}
                />
                <div className="absolute right-0 mt-2 z-50 w-80 rounded-2xl border border-white/10 bg-[#120529]/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl animate-in fade-in slide-in-from-top-3 duration-200 sm:w-96">
                  <div className="mb-2 flex items-center justify-between border-b border-white/5 pb-2.5">
                    <h3 className="text-sm font-bold tracking-wide text-white">
                      Recent Notifications
                    </h3>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-xs font-semibold text-[#f6a1ff] transition-colors hover:text-white"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="max-h-64 space-y-1.5 overflow-y-auto">
                    {mockNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="group cursor-pointer rounded-xl border border-white/5 bg-white/5 p-3 transition-colors hover:bg-white/10"
                      >
                        <p className="text-xs leading-relaxed text-white/80 group-hover:text-white">
                          {notif.text}
                        </p>
                        <span className="mt-1 block text-[10px] text-white/40">
                          {notif.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <Link
            href="/admin/profile"
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
    </header>
  );
}
