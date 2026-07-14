"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteComicButton({
  id,
  title,
}: {
  id: number;
  title: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${title}"? This also removes its reviews, favorites and reading-list entries. This cannot be undone.`,
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/comics/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Could not delete comic.");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Delete comic failed:", error);
      alert("Could not delete — check your connection.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="inline-flex h-11 items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 text-sm font-semibold text-white transition-colors hover:border-red-400/40 hover:bg-red-500/15 disabled:opacity-60"
    >
      <Trash2 className="h-4 w-4" />
      {deleting ? "Deleting…" : "Delete"}
    </button>
  );
}
