"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);
  const [logoutMessage, setLogoutMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (searchParams.get("loggedOut") === "true") {
      setLogoutMessage("Logged out successfully");
    }
  }, [searchParams]);

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
      if (res.error === "no_account") {
        setFormError("No account found with this email address");
      } else {
        // NextAuth returns a raw code (e.g. "CredentialsSignin") — never show it.
        // Stay vague on purpose: don't reveal whether the email exists.
        setFormError("Invalid email or password. Try Again");
      }
      setSubmitting(false);
      return;
    }

    const session = await getSession();
    const role = (session?.user as any)?.role;

    if (role === "ADMIN") {
      router.push("/admin/dashboard");
    } else {
      router.push("/dashboard");
    }

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

      <div className="flex items-center justify-end text-sm text-white/65"></div>

      {logoutMessage && (
        <p className="text-sm text-green-400">{logoutMessage}</p>
      )}

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
