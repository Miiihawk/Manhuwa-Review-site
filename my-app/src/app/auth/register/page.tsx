import Link from "next/link";
import BrandLogo from "../../components/layout/BrandLogo";

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,1,143,0.16),transparent_26%),radial-gradient(circle_at_30%_65%,rgba(246,161,255,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(45,12,98,0.28),transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.96)_0%,rgba(17,1,46,0.92)_42%,rgba(0,0,0,0.99)_100%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10 sm:px-10 lg:px-12">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <section className="max-w-xl lg:order-2">
            <BrandLogo href="/" compact className="max-w-[14rem]" />
            <h1 className="mt-4 text-5xl font-black leading-tight text-white sm:text-6xl">
              Create your account and start archiving.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-white/70">
              Sign up for a profile that keeps your favorites, comments, and
              reading lists in one place.
            </p>
          </section>

          <section className="relative lg:order-1">
            <div className="absolute -left-6 top-10 h-40 w-40 rounded-full bg-[#ff018f]/18 blur-3xl" />
            <div className="absolute -right-6 bottom-8 h-56 w-56 rounded-full bg-[#f6a1ff]/18 blur-3xl" />

            <div className="relative rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:p-8">
              <div className="mb-6">
                <p className="text-sm uppercase tracking-[0.3em] text-[#ff018f]">
                  Sign up
                </p>
                <h2 className="mt-2 text-3xl font-bold text-white">
                  Create your profile
                </h2>
              </div>

              <form className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/75">
                    Username
                  </span>
                  <input
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/75">
                    Email address
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#ff018f] focus:ring-2 focus:ring-[#ff018f]/30"
                  />
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-white/75">
                      Password
                    </span>
                    <input
                      type="password"
                      name="password"
                      placeholder="Create password"
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
                    />
                  </label>
                </div>

                <label className="flex items-start gap-3 text-sm text-white/65">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-black/40 text-[#ff018f] focus:ring-[#ff018f]"
                  />
                  <span>
                    I agree to receive updates and accept the account terms.
                  </span>
                </label>

                <button
                  type="submit"
                  className="inline-flex h-14 w-full items-center justify-center rounded-full bg-[#f6a1ff] px-6 text-base font-semibold text-black transition-transform duration-200 hover:-translate-y-0.5 hover:brightness-110"
                >
                  Sign up
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-white/65">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-[#f6a1ff] hover:text-white"
                >
                  Log in
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
