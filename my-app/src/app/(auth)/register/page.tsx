import Link from "next/link";
import BrandLogo from "../../components/layout/BrandLogo";
import RegisterForm from "../../components/forms/RegisterForm";

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

              <RegisterForm />

              <p className="mt-6 text-center text-sm text-white/65">
                Already have an account?{" "}
                <Link
                  href="/login"
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
