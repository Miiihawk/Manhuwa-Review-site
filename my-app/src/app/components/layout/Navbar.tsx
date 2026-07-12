"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, User, BookOpen, Heart, Bell } from "lucide-react";
import BrandLogo from "./BrandLogo";
import SearchForm from "../forms/SearchForm";

const mockNotifications = [
  {
    id: 1,
    text: "🔥 Solo Leveling Chapter 180 has just been updated!",
    time: "2m ago",
  },
  {
    id: 2,
    text: "💬 JahaFanboy liked your community review on Mad Demon.",
    time: "1h ago",
  },
  {
    id: 3,
    text: "🆕 3 new Action Manhua titles added to your dashboard.",
    time: "5h ago",
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 z-50 w-full bg-gradient-to-b from-black/60 via-black/20 to-transparent py-4">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between px-6 sm:px-10 lg:px-12">
        {/* Left Brand Logo */}
        <BrandLogo
          href="/user/dashboard"
          className="max-w-[14rem] shrink-0"
          compact
        />

        {/* Center Balanced Search Form */}
        <div className="w-full max-w-md md:mx-8">
          <SearchForm />
        </div>

        {/* Right Dashboard Icon Navigation Tracks */}
        <nav className="flex items-center justify-end gap-1.5 sm:gap-3 shrink-0 relative">
          {/* 1. Notification Bell with Click Handler */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-95 group"
              aria-label="Notifications"
            >
              <Bell className="h-[1.15rem] w-[1.15rem] transition duration-200 group-hover:rotate-12" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[#ff018f] px-1 text-[9px] font-black text-white shadow-[0_0_10px_rgba(255,1,143,0.6)]">
                3
              </span>
            </button>

            {/* --- NOTIFICATION POPUP PANEL --- */}
            {isOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsOpen(false)}
                />

                <div className="absolute right-0 mt-2 z-50 w-80 sm:w-96 rounded-2xl border border-white/10 bg-[#120529]/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-2">
                    <h3 className="font-bold text-sm tracking-wide text-white">
                      Recent Alerts
                    </h3>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-xs font-semibold text-[#f6a1ff] hover:text-white transition-colors"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-64 overflow-y-auto">
                    {mockNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer group"
                      >
                        <p className="text-xs text-white/80 group-hover:text-white leading-relaxed">
                          {notif.text}
                        </p>
                        <span className="text-[10px] text-white/40 block mt-1">
                          {notif.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Visual Divider Separator */}
          <div className="h-5 w-[1px] bg-white/10 mx-1 hidden sm:block" />

          {/* 2. Favorites */}
          <Link
            href="/user/favorites"
            title="Favorites"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition-all duration-200 hover:bg-white/10 hover:text-white hover:text-pink-400 active:scale-95"
          >
            <Heart className="h-[1.15rem] w-[1.15rem]" />
          </Link>

          {/* 3. Reading List */}
          <Link
            href="/user/reading-list"
            title="Reading List"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-95"
          >
            <BookOpen className="h-[1.15rem] w-[1.15rem]" />
          </Link>

          {/* 4. Profile */}
          <Link
            href="/user/profile"
            title="Profile"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-95"
          >
            <User className="h-[1.15rem] w-[1.15rem]" />
          </Link>

          {/* 5. Logout */}
          <Link
            href="/auth/logout"
            title="Logout"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/60 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 active:scale-95"
          >
            <LogOut className="h-[1.15rem] w-[1.15rem]" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
