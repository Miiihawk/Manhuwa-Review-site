"use client";

import Link from "next/link";
import {
  Star,
  MessageSquare,
  Heart,
  Shield,
  HelpCircle,
  Layers,
} from "lucide-react";
import BrandLogo from "./BrandLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/5 bg-[#0b021a] text-white/60">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand/Description Column */}
          <div className="space-y-4">
            <BrandLogo
              href="/dashboard"
              className="max-w-[14rem]"
              compact
            />
            <p className="max-w-md text-xs leading-relaxed font-light text-white/40">
              Your ultimate hub for community reviews. Discover hidden gems,
              rate your favorites, and share your perspective with other
              readers.
            </p>
          </div>

          {/* Navigation Links Columns */}
          <div className="mt-8 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Explore
                </h3>
                <ul role="list" className="mt-3 space-y-2">
                  <li>
                    <Link
                      href="/comicseries"
                      className="flex items-center gap-1.5 text-xs transition-colors hover:text-pink-500"
                    >
                      <Layers className="h-3 w-3" /> Directory
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/top-rated"
                      className="flex items-center gap-1.5 text-xs transition-colors hover:text-pink-500"
                    >
                      <Star className="h-3 w-3" /> Top Rated
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/recent-reviews"
                      className="flex items-center gap-1.5 text-xs transition-colors hover:text-pink-500"
                    >
                      <MessageSquare className="h-3 w-3" /> Latest Reviews
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Community
                </h3>
                <ul role="list" className="mt-3 space-y-2">
                  <li>
                    <Link
                      href="/user/favorites"
                      className="flex items-center gap-1.5 text-xs transition-colors hover:text-pink-500"
                    >
                      <Heart className="h-3 w-3" /> Favorites
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/guidelines"
                      className="flex items-center gap-1.5 text-xs transition-colors hover:text-pink-500"
                    >
                      <HelpCircle className="h-3 w-3" /> Review Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                Legal
              </h3>
              <ul role="list" className="mt-3 space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="flex items-center gap-1.5 text-xs transition-colors hover:text-pink-500"
                  >
                    <Shield className="h-3 w-3" /> Privacy Policy
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
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium tracking-wide text-white/30">
          <p>&copy; {currentYear} Review Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for the community by fans, for fans.
          </p>
        </div>
      </div>
    </footer>
  );
}
