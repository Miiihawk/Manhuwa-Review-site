"use client";

import { useState } from "react";
import { Flag } from "lucide-react";

const REASONS: { value: string; label: string }[] = [
  { value: "SPAM", label: "Spam" },
  { value: "HARASSMENT", label: "Harassment" },
  { value: "HATE_SPEECH", label: "Hate Speech" },
  { value: "INAPPROPRIATE_CONTENT", label: "Inappropriate Content" },
  { value: "MISINFORMATION", label: "Misinformation" },
  { value: "COPYRIGHT_VIOLATION", label: "Copyright Violation" },
  { value: "OTHER", label: "Others" },
];

export default function ReportButton({
  target,
}: {
  target: { reviewId?: number; commentId?: number };
}) {
  const [open, setOpen] = useState(false);
  const [reported, setReported] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(reason: string) {
    setBusy(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, ...target }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Could not submit report.");
        return;
      }
      setReported(true);
      setOpen(false);
    } catch (error) {
      console.error("Report failed:", error);
      alert("Could not submit report — check your connection.");
    } finally {
      setBusy(false);
    }
  }

  if (reported) {
    return (
      <span className="text-[10px] font-bold text-white/40">Reported</span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        title="Report"
        className="p-1.5 rounded-md bg-white/5 text-white/40 hover:text-amber-400 hover:bg-white/10 transition"
      >
        <Flag className="h-3 w-3" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 z-50 w-52 rounded-xl border border-white/10 bg-[#120529]/95 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
            <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white/35">
              Report reason
            </p>
            {REASONS.map((r) => (
              <button
                key={r.value}
                disabled={busy}
                onClick={() => submit(r.value)}
                className="block w-full rounded-lg px-2 py-1.5 text-left text-xs text-white/75 hover:bg-white/10 hover:text-white transition disabled:opacity-40"
              >
                {r.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
