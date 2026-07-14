"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

export default function RemoveFavoriteButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRemove() {
    setLoading(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      if (!res.ok) {
        alert("Could not remove favorite.");
        return;
      }

      router.refresh(); // re-run the server component so the tile disappears
    } catch (error) {
      console.error("Remove favorite failed:", error);
      alert("Could not remove favorite — check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      title="Remove from favorites"
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 border border-red-500/20 hover:text-white transition-all duration-150 active:scale-95"
    >
      <Heart className="h-3.5 w-3.5 fill-current" />
    </button>
  );
}
