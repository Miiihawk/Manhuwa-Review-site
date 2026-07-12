import Link from "next/link";
import BrandLogo from "../../components/layout/BrandLogo";

export default function ForgotPasswordPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Immersive Theme Ambient Mesh Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,1,143,0.16),transparent_26%),radial-gradient(circle_at_70%_20%,rgba(45,12,98,0.24),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(246,161,255,0.12),transparent_26%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.96)_0%,rgba(17,1,46,0.92)_42%,rgba(0,0,0,0.99)_100%)]" />

      {/* Balanced Center Layout Wrapper */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10 sm:px-10 lg:px-12">
        <div className="grid w-full gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          {/* Left Side: Context/Marketing Copy */}
          <section className="max-w-xl">
            <BrandLogo href="/" compact className="max-w-[14rem]" />
            <h1 className="mt-4 text-5xl font-black leading-tight text-white sm:text-6xl">
              Lost track of your vault?
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-white/70">
              Don&apos;t worry. Enter your email, and we will send you a secure
              link to recover your reading archive.
            </p>
          </section>

          {/* Right Side: Interactive Glassmorphic Card */}
          <section className="relative">
            {/* Card Background Fluid Glowing Accents */}
            <div className="absolute -left-6 top-10 h-40 w-40 rounded-full bg-[#ff018f]/15 blur-3xl" />
            <div className="absolute -right-6 bottom-8 h-56 w-56 rounded-full bg-[#f6a1ff]/15 blur-3xl" />

            <div className="relative rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:p-8">
              <div className="mb-6">
                <p className="text-sm uppercase tracking-[0.3em] text-[#f6a1ff]">
                  Recovery
                </p>
                <h2 className="mt-2 text-3xl font-bold text-white">
                  Reset password
                </h2>
              </div>

              {/* Recovery Form Actions */}
              <form className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/75">
                    Email address
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#ff018f] focus:ring-2 focus:ring-[#ff018f]/30"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex h-14 w-full items-center justify-center rounded-full bg-[#ff018f] px-6 text-base font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:brightness-110 shadow-lg shadow-pink-600/20"
                >
                  Send Reset Link
                </button>
              </form>

              {/* Dynamic Footer Context Navigation links */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/65 border-t border-white/5 pt-6">
                <Link
                  href="/auth/login" // Remember to adjust this route if your login is nested differently!
                  className="font-medium text-white/50 hover:text-white transition-colors flex items-center gap-2"
                >
                  ← Back to Login
                </Link>

                <p>
                  New here?{" "}
                  <Link
                    href="/auth/register"
                    className="font-semibold text-[#f6a1ff] hover:text-white transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
