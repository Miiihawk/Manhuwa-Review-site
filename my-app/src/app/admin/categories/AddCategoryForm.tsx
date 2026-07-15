"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function AddCategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Could not add category.");
        return;
      }

      setName("");
      router.refresh();
    } catch (error) {
      console.error("Add category failed:", error);
      alert("Could not add category — check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Category name (e.g. Manhwa)"
        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
      />
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#ff018f_0%,#f6a1ff_100%)] px-5 text-sm font-black tracking-wide text-black shadow-[0_14px_32px_rgba(255,24,143,0.28)] transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60"
      >
        <Plus className="h-4 w-4" />
        {submitting ? "Adding…" : "Add category"}
      </button>
    </form>
  );
}
