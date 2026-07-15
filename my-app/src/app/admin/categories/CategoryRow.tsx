"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit3, Trash2, Check, X } from "lucide-react";

export default function CategoryRow({
  category,
}: {
  category: { id: number; name: string; count: number };
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [busy, setBusy] = useState(false);

  async function handleSave() {
    if (!name.trim() || name.trim() === category.name) {
      setEditing(false);
      setName(category.name);
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Could not rename category.");
        return;
      }

      setEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Rename category failed:", error);
      alert("Could not rename — check your connection.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(`Delete the category "${category.name}"?`);
    if (!confirmed) return;

    setBusy(true);
    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.error || "Could not delete category.");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Delete category failed:", error);
      alert("Could not delete — check your connection.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="flex flex-col gap-4 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f6a1ff]">
          Category
        </p>

        {editing ? (
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoFocus
            className="mt-2 w-full max-w-xs rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-2xl font-black text-white outline-none focus:border-[#f6a1ff]"
          />
        ) : (
          <h3 className="mt-2 text-2xl font-black text-white">
            {category.name}
          </h3>
        )}

        <p className="mt-1 text-sm text-white/55">
          Used in {category.count} comics
        </p>
      </div>

      <div className="flex flex-wrap gap-2 lg:justify-end">
        {editing ? (
          <>
            <button
              type="button"
              onClick={handleSave}
              disabled={busy}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-400/20 disabled:opacity-60"
            >
              <Check className="h-4 w-4" />
              {busy ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setName(category.name);
              }}
              disabled={busy}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[#f6a1ff]/25 bg-white/5 px-4 text-sm font-semibold text-white transition-colors hover:border-[#ff018f]/50 hover:bg-white/10"
            >
              <Edit3 className="h-4 w-4" />
              Edit category
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={busy}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 text-sm font-semibold text-white transition-colors hover:border-red-400/40 hover:bg-red-500/15 disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              {busy ? "Deleting…" : "Delete category"}
            </button>
          </>
        )}
      </div>
    </article>
  );
}
