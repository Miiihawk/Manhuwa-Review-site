"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";

const STATUSES = [
  { value: "READING", label: "Reading" },
  { value: "PLAN_TO_READ", label: "Plan to Read" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REREADING", label: "Rereading" },
  { value: "PAUSED", label: "Paused" },
  { value: "DROPPED", label: "Dropped" },
];

export default function ReadingListButton({ slug }: { slug: string }) {
  const [status, setStatus] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadStatus() {
      try {
        const res = await fetch(`/api/reading-list?slug=${slug}`);
        if (!res.ok) return;
        const data = await res.json();
        if (active) setStatus(data.status);
      } catch (error) {
        console.error("Failed to load reading status:", error);
      }
    }
    loadStatus();
    return () => {
      active = false;
    };
  }, [slug]);

  async function setListStatus(newStatus: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/reading-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, status: newStatus }),
      });
      if (res.status === 401) {
        alert("Please log in to track your reading.");
        return;
      }
      if (!res.ok) {
        alert("Could not update reading list.");
        return;
      }
      setStatus(newStatus);
      setOpen(false);
    } catch (error) {
      console.error("Set status failed:", error);
      alert("Could not update — check your connection.");
    } finally {
      setLoading(false);
    }
  }

  async function removeFromList() {
    setLoading(true);
    try {
      const res = await fetch("/api/reading-list", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (!res.ok) {
        alert("Could not remove from list.");
        return;
      }
      setStatus(null);
      setOpen(false);
    } catch (error) {
      console.error("Remove failed:", error);
      alert("Could not remove — check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        title="Reading list"
        className={`flex h-11 w-full items-center justify-center rounded-lg border transition active:scale-95 select-none ${
          status
            ? "bg-[#f6a1ff]/20 border-[#f6a1ff]/40 text-[#f6a1ff]"
            : "bg-white/5 hover:bg-white/10 border-white/10 text-white/80 hover:text-white"
        }`}
      >
        <Bookmark className={`h-4 w-4 ${status ? "fill-current" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-white/10 bg-[#120529] p-1 shadow-xl">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setListStatus(s.value)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-xs font-semibold transition ${
                status === s.value
                  ? "bg-[#ff018f]/20 text-[#f6a1ff]"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              {s.label}
            </button>
          ))}
          {status && (
            <button
              onClick={removeFromList}
              className="block w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-400 hover:bg-red-500/10"
            >
              Remove from list
            </button>
          )}
        </div>
      )}
    </div>
  );
}
