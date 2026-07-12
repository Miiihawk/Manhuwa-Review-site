"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      if (res.status === 400 && data.errors) {
        setErrors(data.errors);
      } else if (res.status === 409) {
        setFormError(data.error);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } catch {
      setFormError("Could not reach the server. Check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
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

        {errors.username && (
          <span className="mt-1 block text-sm text-red-400">
            {errors.username[0]}
          </span>
        )}
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
        {errors.email && (
          <span className="mt-1 block text-sm text-red-400">
            {errors.email[0]}
          </span>
        )}
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
          {errors.password && (
            <span className="mt-1 block text-sm text-red-400">
              {errors.password[0]}
            </span>
          )}
        </label>
      </div>

      <label className="flex items-start gap-3 text-sm text-white/65">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-white/20 bg-black/40 text-[#ff018f] focus:ring-[#ff018f]"
        />
        <span>I agree to receive updates and accept the account terms.</span>
      </label>

      {formError && <p className="text-sm text-red-400">{formError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-14 w-full items-center justify-center rounded-full bg-[#f6a1ff] px-6 text-base font-semibold text-black transition-transform duration-200 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60"
      >
        {submitting ? "Creating account…" : "Sign up"}
      </button>
    </form>
  );
}
