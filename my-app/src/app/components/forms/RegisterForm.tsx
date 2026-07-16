"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [password, setPassword] = useState("");

  const passwordChecks = {
    length: password.length >= 8,
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };
  const metCount = Object.values(passwordChecks).filter(Boolean).length;
  const passwordStrong = metCount === 4;
  const strengthColor =
    metCount <= 2
      ? "bg-red-500"
      : metCount === 3
        ? "bg-amber-400"
        : "bg-emerald-400";
  const strengthLabel =
    metCount <= 2 ? "Weak" : metCount === 3 ? "Medium" : "Strong";
  const requirements = [
    { ok: passwordChecks.length, label: "At least 8 characters" },
    { ok: passwordChecks.lower, label: "A lowercase letter" },
    { ok: passwordChecks.upper, label: "An uppercase letter" },
    { ok: passwordChecks.number, label: "A number" },
  ];

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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create password"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
          />
          {errors.password && (
            <span className="mt-1 block text-sm text-red-400">
              {errors.password[0]}
            </span>
          )}

          {password.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i < metCount ? strengthColor : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-semibold text-white/60">
                  {strengthLabel}
                </span>
              </div>
              <ul className="space-y-1">
                {requirements.map((req) => (
                  <li
                    key={req.label}
                    className={`flex items-center gap-1.5 text-xs ${
                      req.ok ? "text-emerald-400" : "text-white/40"
                    }`}
                  >
                    {req.ok ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    {req.label}
                  </li>
                ))}
              </ul>
            </div>
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
        disabled={submitting || !passwordStrong}
        className="inline-flex h-14 w-full items-center justify-center rounded-full bg-[#f6a1ff] px-6 text-base font-semibold text-black transition-transform duration-200 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60"
      >
        {submitting ? "Creating account…" : "Sign up"}
      </button>
    </form>
  );
}
