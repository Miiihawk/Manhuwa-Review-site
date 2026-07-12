import Link from "next/link";

export default function LogoutPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white sm:px-10 lg:px-12">
      <section className="mx-auto max-w-2xl rounded-4xl bg-white/5 p-8 text-center backdrop-blur-md">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#f6a1ff]/90">
          Logout
        </p>
        <h1 className="mt-4 text-4xl font-black">You&apos;re signed out</h1>
        <p className="mt-3 text-white/65">
          This is the logout page placeholder for now.
        </p>
        <Link
          href="/auth/login"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(180deg,#ff018f_0%,#f6a1ff_100%)] px-5 text-sm font-black tracking-wide text-black"
        >
          Log back in
        </Link>
      </section>
    </main>
  );
}
