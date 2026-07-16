"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, ExternalLink } from "lucide-react";

const REASON_LABELS: Record<string, string> = {
  SPAM: "Spam",
  HARASSMENT: "Harassment",
  HATE_SPEECH: "Hate Speech",
  INAPPROPRIATE_CONTENT: "Inappropriate Content",
  MISINFORMATION: "Misinformation",
  COPYRIGHT_VIOLATION: "Copyright Violation",
  OTHER: "Others",
};

const reasonOptions = ["All Reasons", ...Object.values(REASON_LABELS)];

type Entry = {
  id: number;
  type: "Review" | "Comment";
  comic: string;
  author: string;
  reporter: string;
  rating: string;
  status: "PENDING" | "DISMISSED";
  text: string;
  reason: string;
  link: string | null;
};

type ReportRow = {
  id: number;
  reason: string;
  status: "PENDING" | "DISMISSED" | "REVIEWED" | "ACTIONED";
  reviewId: number | null;
  commentId: number | null;
  reporter: { username: string } | null;
  review: {
    rating: number;
    review: string | null;
    user: { username: string } | null;
    comic: { title: string; slug: string } | null;
  } | null;
  comment: {
    content: string;
    user: { username: string } | null;
    comic: { title: string; slug: string } | null;
    review: { comic: { title: string; slug: string } | null } | null;
  } | null;
};

function toEntry(r: ReportRow): Entry {
  const isReview = r.reviewId != null;
  const comic = isReview
    ? r.review?.comic
    : (r.comment?.comic ?? r.comment?.review?.comic ?? null);
  return {
    id: r.id,
    type: isReview ? "Review" : "Comment",
    comic: comic?.title ?? "—",
    author:
      (isReview ? r.review?.user?.username : r.comment?.user?.username) ??
      "Unknown",
    reporter: r.reporter?.username ?? "Unknown",
    rating: isReview && r.review?.rating != null ? String(r.review.rating) : "",
    status: r.status === "DISMISSED" ? "DISMISSED" : "PENDING",
    text: (isReview ? r.review?.review : r.comment?.content) ?? "",
    reason: REASON_LABELS[r.reason] ?? r.reason,
    link: comic?.slug ? `/${comic.slug}` : null,
  };
}

export default function AdminReviewsPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [reasonFilter, setReasonFilter] = useState("All Reasons");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/reports")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: ReportRow[]) => {
        if (active) setEntries(data.map(toEntry));
      })
      .catch((error) => console.error("Failed to load reports:", error));
    return () => {
      active = false;
    };
  }, []);

  const totalReviews = entries.filter((e) => e.type === "Review").length;
  const totalComments = entries.filter((e) => e.type === "Comment").length;
  const pendingCount = entries.filter((e) => e.status === "PENDING").length;
  const dismissedCount = entries.filter((e) => e.status === "DISMISSED").length;

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesType = typeFilter === "All" || entry.type === typeFilter;
      const matchesStatus =
        statusFilter === "All Statuses" ||
        (statusFilter === "Pending" && entry.status === "PENDING") ||
        (statusFilter === "Dismissed" && entry.status === "DISMISSED");
      const matchesReason =
        reasonFilter === "All Reasons" || entry.reason === reasonFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q.length === 0 ||
        entry.author.toLowerCase().includes(q) ||
        entry.reporter.toLowerCase().includes(q) ||
        entry.comic.toLowerCase().includes(q) ||
        entry.text.toLowerCase().includes(q);
      return matchesType && matchesStatus && matchesReason && matchesSearch;
    });
  }, [entries, reasonFilter, searchQuery, statusFilter, typeFilter]);

  async function resolve(id: number, action: "dismiss" | "remove") {
    if (
      action === "remove" &&
      !confirm("Remove this content? This permanently deletes it.")
    )
      return;
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Could not resolve report.");
        return;
      }
      if (action === "remove") {
        setEntries((prev) => prev.filter((e) => e.id !== id));
      } else {
        setEntries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: "DISMISSED" } : e)),
        );
      }
    } catch (error) {
      console.error("Resolve report failed:", error);
      alert("Could not resolve report — check your connection.");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,1,143,0.16),transparent_24%),radial-gradient(circle_at_75%_20%,rgba(45,12,98,0.35),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(246,161,255,0.12),transparent_26%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.96)_0%,rgba(17,1,46,0.94)_45%,rgba(0,0,0,0.98)_100%)]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-28 sm:px-10 lg:px-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/admin/dashboard"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-white/65 transition-colors hover:text-[#f6a1ff]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to dashboard
          </Link>
        </div>

        <section>
          <div className="flex flex-col gap-5 border-b border-white/10 pb-6">
            <div className="max-w-5xl">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#f6a1ff]">
                Reviews and Comments
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl lg:whitespace-nowrap">
                Reported reviews &amp; comments.
              </h1>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#ff018f]/25 bg-[#ff018f]/10 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#f6a1ff]">
                  Reported Reviews
                </p>
                <p className="mt-1 text-lg font-black text-white">
                  {totalReviews}
                </p>
              </div>
              <div className="rounded-2xl border border-[#d9ccff]/20 bg-[#11012e]/80 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#d9ccff]">
                  Reported Comments
                </p>
                <p className="mt-1 text-lg font-black text-white">
                  {totalComments}
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#d9ccff]/20 bg-[#11012e]/80 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#d9ccff]">
                  Pending
                </p>
                <p className="mt-1 text-lg font-black text-white">
                  {pendingCount}
                </p>
              </div>
              <div className="rounded-2xl border border-[#d9ccff]/20 bg-[#11012e]/80 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#d9ccff]">
                  Dismissed
                </p>
                <p className="mt-1 text-lg font-black text-white">
                  {dismissedCount}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#11012e]/70">
            <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25 [&>option]:bg-[#120529]"
                >
                  <option value="All">All</option>
                  <option value="Review">Review</option>
                  <option value="Comment">Comment</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25 [&>option]:bg-[#120529]"
                >
                  <option value="All Statuses">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Dismissed">Dismissed</option>
                </select>
                <select
                  value={reasonFilter}
                  onChange={(e) => setReasonFilter(e.target.value)}
                  className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25 [&>option]:bg-[#120529]"
                >
                  {reasonOptions.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full max-w-sm">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reports"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
                />
              </div>
            </div>

            <div className="divide-y divide-white/10">
              {filteredEntries.length === 0 && (
                <div className="px-5 py-10 text-center sm:px-6">
                  <p className="text-sm font-semibold text-white/75">
                    No reports found.
                  </p>
                  <p className="mt-2 text-sm text-white/45">
                    Nothing to moderate — or try changing the filters.
                  </p>
                </div>
              )}
              {filteredEntries.map((entry) => (
                <article
                  key={entry.id}
                  className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] ${
                          entry.status === "PENDING"
                            ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
                            : "border-white/10 bg-white/5 text-white/55"
                        }`}
                      >
                        {entry.status === "PENDING" ? "Pending" : "Dismissed"}
                      </span>
                      <span className="rounded-full border border-[#ff018f]/20 bg-[#ff018f]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[#f6a1ff]">
                        {entry.type}
                      </span>
                      {entry.type === "Review" && entry.rating && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[#d9ccff]">
                          {entry.rating} stars
                        </span>
                      )}
                      {entry.link ? (
                        <Link
                          href={entry.link}
                          className="inline-flex items-center gap-1 text-xs font-medium text-white/45 transition-colors hover:text-[#f6a1ff]"
                        >
                          Title: {entry.comic}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      ) : (
                        <span className="text-xs font-medium text-white/45">
                          Title: {entry.comic}
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white/88">
                        <span className="font-bold text-[#f6a1ff]">
                          Author:
                        </span>{" "}
                        {entry.author}
                        <span className="ml-3 font-bold text-[#f6a1ff]">
                          Reported by:
                        </span>{" "}
                        {entry.reporter}
                      </p>
                      <p className="mt-2 text-sm text-white/66">
                        <span className="font-bold text-[#f6a1ff]">
                          {entry.type}:
                        </span>{" "}
                        {entry.text || "(no text)"}
                      </p>
                      <p className="mt-2 text-sm text-white/66">
                        <span className="font-bold text-[#f6a1ff]">
                          Reason:
                        </span>{" "}
                        {entry.reason}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {entry.status === "PENDING" && (
                      <button
                        type="button"
                        onClick={() => resolve(entry.id, "dismiss")}
                        className="inline-flex h-11 items-center gap-2 rounded-full border border-[#f6a1ff]/25 bg-white/5 px-4 text-sm font-semibold text-white transition-colors hover:border-[#ff018f]/50 hover:bg-white/10"
                      >
                        Dismiss
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => resolve(entry.id, "remove")}
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 text-sm font-semibold text-white transition-colors hover:border-red-400/40 hover:bg-red-500/15"
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
