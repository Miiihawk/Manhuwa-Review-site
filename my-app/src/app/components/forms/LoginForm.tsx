"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setFormError(res.error || "Invalid email or password");
      setSubmitting(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }
  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
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

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-white/75">
          Password
        </span>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
        />
      </label>

      <div className="flex items-center justify-end text-sm text-white/65">
        <Link
          href="/auth/forgot-password"
          className="text-[#f6a1ff] hover:text-white"
        >
          Forgot password?
        </Link>
      </div>

      {formError && <p className="text-sm text-red-400">{formError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-14 w-full items-center justify-center rounded-full bg-[#ff018f] px-6 text-base font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60"
      >
        {submitting ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
