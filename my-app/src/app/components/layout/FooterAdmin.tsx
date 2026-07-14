"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  MessageSquareMore,
  Tags,
  Shapes,
} from "lucide-react";

export default function FooterAdmin() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/5 bg-[#0b021a] text-white/60">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-12">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Admin Utilities
            </h3>
            <ul role="list" className="mt-3 space-y-2">
              <li>
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-1.5 text-xs transition-colors hover:text-pink-500"
                >
                  <LayoutDashboard className="h-3 w-3" /> Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/comics"
                  className="flex items-center gap-1.5 text-xs transition-colors hover:text-pink-500"
                >
                  <BookOpen className="h-3 w-3" /> Comics
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/users"
                  className="flex items-center gap-1.5 text-xs transition-colors hover:text-pink-500"
                >
                  <Users className="h-3 w-3" /> Users
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Content Tools
            </h3>
            <ul role="list" className="mt-3 space-y-2">
              <li>
                <Link
                  href="/admin/reviews"
                  className="flex items-center gap-1.5 text-xs transition-colors hover:text-pink-500"
                >
                  <MessageSquareMore className="h-3 w-3" /> Reviews
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/genres"
                  className="flex items-center gap-1.5 text-xs transition-colors hover:text-pink-500"
                >
                  <Tags className="h-3 w-3" /> Genres
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/categories"
                  className="flex items-center gap-1.5 text-xs transition-colors hover:text-pink-500"
                >
                  <Shapes className="h-3 w-3" /> Categories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Admin Support
            </h3>
            <ul role="list" className="mt-3 space-y-2">
              <li>
                <Link
                  href="/guidelines"
                  className="flex items-center gap-1.5 text-xs transition-colors hover:text-pink-500"
                >
                Policy Reference
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="flex items-center gap-1.5 text-xs transition-colors hover:text-pink-500"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="flex items-center gap-1.5 text-xs transition-colors hover:text-pink-500"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul role="list" className="mt-3 space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-xs transition-colors hover:text-pink-500"
                >
                  Main Site Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/comicseries"
                  className="flex items-center gap-1.5 text-xs transition-colors hover:text-pink-500"
                >
                  Browse Directory
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/5 pt-6 text-[11px] font-medium tracking-wide text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {currentYear} Review Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for the community by fans, for fans.
          </p>
        </div>
      </div>
    </footer>
  );
}