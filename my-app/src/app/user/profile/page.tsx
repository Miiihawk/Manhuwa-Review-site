import Link from "next/link";
import { User, Mail, Shield, Calendar, ArrowLeft, Edit2 } from "lucide-react";
import Navbar from "../../components/layout/Navbar"; // Import your fresh navbar layout module!

export default function ProfilePage() {
  const user = {
    username: "John Doe",
    email: "john.doe@example.com",
    role: "User",
    joinedDate: "Joined Jan 2026",
    stats: [
      { label: "Completed", count: 42 },
      { label: "Reading", count: 18 },
      { label: "Favorites", count: 124 },
    ],
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Universal Shared Floating Header */}
      <Navbar />

      {/* Immersive Background Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,1,143,0.12),transparent_30%),radial-gradient(circle_at_70%_20%,rgba(45,12,98,0.2),transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.98)_0%,rgba(11,2,26,0.95)_50%,rgba(0,0,0,1)_100%)]" />

      {/* Profile Card Workspace - pt-24 keeps the content clean below the navbar layer */}
      <div className="relative mx-auto max-w-4xl px-6 pt-28 pb-10 sm:px-10 lg:px-12 z-10">
        {/* Navigation Back Link */}
        <Link
          href="/user/dashboard"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-[#f6a1ff] mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>

        {/* --- PROFILE BANNER CARD --- */}
        <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#ff018f]/10 blur-2xl" />

          {/* Header Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div className="flex items-center gap-5">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#ff018f] to-[#f6a1ff] text-2xl font-black text-white shadow-[0_0_30px_rgba(255,1,143,0.3)]">
                {user.username.substring(0, 2).toUpperCase()}
                <button className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-md bg-black/80 border border-white/10 text-white hover:text-[#f6a1ff] transition-colors">
                  <Edit2 className="h-3 w-3" />
                </button>
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 px-2.5 py-0.5 text-xs font-bold text-[#f6a1ff]">
                  <Shield className="h-3 w-3" /> {user.role}
                </span>
                <h1 className="mt-1.5 text-3xl font-black tracking-tight">
                  {user.username}
                </h1>
                <p className="text-xs text-white/40 flex items-center gap-1 mt-1">
                  <Calendar className="h-3 w-3" /> {user.joinedDate}
                </p>
              </div>
            </div>

            <button className="inline-flex h-10 items-center justify-center rounded-full bg-white/10 border border-white/5 px-5 text-xs font-bold tracking-wide text-white transition hover:bg-white/15 active:scale-95">
              Edit Preferences
            </button>
          </div>

          {/* --- QUICKSTATS GRID TRACK --- */}
          <div className="grid grid-cols-3 gap-4 py-6 border-b border-white/5 text-center sm:text-left">
            {user.stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-4"
              >
                <p className="text-2xl font-black tracking-tight text-white">
                  {stat.count}
                </p>
                <p className="text-xs font-bold uppercase tracking-wider text-white/40 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* --- ACCOUNT INFO / FORM LABELS --- */}
          <div className="mt-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#f6a1ff] mb-4">
              Account Details
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
                <div className="flex items-center gap-3">
                  <User className="h-[1.15rem] w-[1.15rem] text-white/40" />
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-white/35">
                      Display Name
                    </p>
                    <p className="text-sm font-semibold text-white/90 mt-0.5">
                      {user.username}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
                <div className="flex items-center gap-3">
                  <Mail className="h-[1.15rem] w-[1.15rem] text-white/40" />
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-white/35">
                      Email Address
                    </p>
                    <p className="text-sm font-semibold text-white/90 mt-0.5">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
