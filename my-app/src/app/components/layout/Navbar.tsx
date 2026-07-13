"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, User, BookOpen, Heart, Bell, Layers } from "lucide-react";
import BrandLogo from "./BrandLogo";
import SearchForm from "../forms/SearchForm";
import LogoutButton from "./LogoutButton";

const mockNotifications = [
  {
    id: 1,
    text: "💬 JahaFanboy liked your community review on Mad Demon.",
    time: "1h ago",
  },
  {
    id: 2,
    text: "💬 LloydFanatic liked your community review on The Greatest Estate Developer",
    time: "1h ago",
  },
  {
    id: 3,
    text: "💬 Grandfell Claudi Arpheus Romeo liked your community review on The Player Hides His Past.",
    time: "1h ago",
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 z-50 w-full bg-gradient-to-b from-black/60 via-black/20 to-transparent py-4">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 sm:px-10 lg:px-12 md:flex-row md:items-center md:justify-between">
        {/* Left Side: Brand Logo */}
        <div className="flex shrink-0 items-center gap-6">
          <BrandLogo href="/dashboard" className="max-w-[14rem]" compact />
        </div>

        {/* Center Balanced Search Form */}
        <div className="w-full max-w-md md:mx-8">
          <SearchForm />
        </div>

        {/* Right Dashboard Icon Navigation Tracks */}
        <nav className="relative flex shrink-0 items-center justify-end gap-1.5 sm:gap-3">
          {/* 1. Series Catalog */}
          <Link
            href="/comicseries"
            title="Series Catalog"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition-all duration-200 hover:bg-white/10 hover:text-[#ff018f] active:scale-95"
          >
            <Layers className="h-[1.15rem] w-[1.15rem]" />
          </Link>

          {/* 2. Notification Bell Dropdown Controller */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-95"
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

          {/* Visual Divider Separator */}
          <div className="mx-1 hidden h-5 w-[1px] bg-white/10 sm:block" />

          {/* 3. Favorites */}
          <Link
            href="/favorites"
            title="Favorites"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition-all duration-200 hover:bg-white/10 hover:text-pink-400 active:scale-95"
          >
            <Heart className="h-[1.15rem] w-[1.15rem]" />
          </Link>

          {/* 4. Reading List */}
          <Link
            href="/reading-list"
            title="Reading List"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-95"
          >
            <BookOpen className="h-[1.15rem] w-[1.15rem]" />
          </Link>

          {/* 5. Profile */}
          <Link
            href="/profile"
            title="Profile"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-95"
          >
            <User className="h-[1.15rem] w-[1.15rem]" />
          </Link>

          {/* 6. Logout */}
          <LogoutButton />
        </nav>
      </div>
    </header>
  );
}
