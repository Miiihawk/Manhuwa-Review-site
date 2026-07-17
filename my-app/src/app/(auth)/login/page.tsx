import { Suspense } from "react";
import Link from "next/link";
import BrandLogo from "../../components/layout/BrandLogo";
import LoginForm from "../../components/forms/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,1,143,0.16),transparent_26%),radial-gradient(circle_at_70%_20%,rgba(45,12,98,0.24),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(246,161,255,0.12),transparent_26%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.96)_0%,rgba(17,1,46,0.92)_42%,rgba(0,0,0,0.99)_100%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10 sm:px-10 lg:px-12">
        <div className="grid w-full gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <section className="max-w-xl">
            <BrandLogo href="/" compact className="max-w-[14rem]" />
            <h1 className="mt-4 text-5xl font-black leading-tight text-white sm:text-6xl">
              Welcome back to your reading archive.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-white/70">
              Log in to continue your favorites, reviews, and reading lists.
            </p>
          </section>

          <section className="relative">
            <div className="absolute -left-6 top-10 h-40 w-40 rounded-full bg-[#ff018f]/18 blur-3xl" />
            <div className="absolute -right-6 bottom-8 h-56 w-56 rounded-full bg-[#f6a1ff]/18 blur-3xl" />

            <div className="relative rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:p-8">
              <div className="mb-6">
                <p className="text-sm uppercase tracking-[0.3em] text-[#f6a1ff]">
                  Log in
                </p>
                <h2 className="mt-2 text-3xl font-bold text-white">
                  Access your account
                </h2>
              </div>

              <Suspense fallback={null}>
                <LoginForm />
              </Suspense>

              <p className="mt-6 text-center text-sm text-white/65">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-[#f6a1ff] hover:text-white"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
