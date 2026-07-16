"use client";

import Link from "next/link";
import {
  BookOpen,
  Folder,
  Home,
  MessageSquare,
  Tag,
  User,
  Users,
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import LogoutButton from "./LogoutButton";

const adminShortcuts = [
  { href: "/admin/comics", label: "Comic Management", icon: BookOpen },
  { href: "/admin/users", label: "User Management", icon: Users },
  {
    href: "/admin/reviews",
    label: "Review and Comment Management",
    icon: MessageSquare,
  },
  { href: "/admin/genres", label: "Genre Management", icon: Tag },
  { href: "/admin/categories", label: "Category Management", icon: Folder },
  { href: "/dashboard", label: "View User Site", icon: Home },
];

export default function AdminNavbar() {
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
