"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";

const initialEntries = [
	{
		id: 1,
		type: "Review",
		comic: "Debut or Die",
		user: "Ari Valen",
		rating: "5.0",
		status: "Pending",
		comment: "Strong start, great pacing, and the art direction is consistent.",
		reportReason: "Spam",
	},
	{
		id: 2,
		type: "Comment",
		comic: "Life of a Quack Healer",
		user: "Mika Sol",
		status: "Deleted",
		comment: "Funny and energetic. The supporting cast carries the charm well.",
		reportReason: "Others",
	},
	{
		id: 3,
		type: "Review",
		comic: "The Ultimate Shut In",
		user: "Jae Kim",
		rating: "2.0",
		status: "Dissolved",
		comment: "Contains spammy language and should be reviewed for moderation.",
		reportReason: "Harassment",
		adminNote: "Resolved after moderator review. Warning issued to reporter and author.",
	},
	{
		id: 4,
		type: "Comment",
		comic: "Return of The Mad Demon",
		user: "Nora Lin",
		status: "Pending",
		comment: "Fast and fun. The main character stands out immediately.",
		reportReason: "Inappropriate Content",
	},
	{
		id: 5,
		type: "Review",
		comic: "The Greatest Estate Developer",
		user: "Lio Crest",
		rating: "4.9",
		status: "Deleted",
		comment: "One of the funniest series in the lineup with strong pacing.",
		reportReason: "Copyright Violation",
	},
	{
		id: 6,
		type: "Comment",
		comic: "Omniscient Reader",
		user: "Sera Vale",
		status: "Dissolved",
		comment: "This thread was settled after context was added by the staff.",
		reportReason: "Misinformation",
		adminNote: "Discussion archived. No further action required.",
	},
]

const reasonOptions = [
	"All Reasons",
	"Spam",
	"Harassment",
	"Hate Speech",
	"Inappropriate Content",
	"Misinformation",
	"Copyright Violation",
	"Others",
];

export default function AdminReviewsPage() {
	const [entries, setEntries] = useState(initialEntries);
	const [typeFilter, setTypeFilter] = useState("All");
	const [statusFilter, setStatusFilter] = useState("All Statuses");
	const [reasonFilter, setReasonFilter] = useState("All Reasons");
	const [searchQuery, setSearchQuery] = useState("");
	const [editingNoteEntry, setEditingNoteEntry] = useState<(typeof initialEntries)[number] | null>(null);

	const totalReviews = entries.filter((entry) => entry.type === "Review").length;
	const totalComments = entries.filter((entry) => entry.type === "Comment").length;
	const pendingCount = entries.filter((entry) => entry.status === "Pending").length;
	const deletedCount = entries.filter((entry) => entry.status === "Deleted").length;
	const dissolvedCount = entries.filter((entry) => entry.status === "Dissolved").length;

	const filteredEntries = useMemo(() => {
		return entries.filter((entry) => {
			const matchesType = typeFilter === "All" || entry.type === typeFilter;
			const matchesStatus =
				statusFilter === "All Statuses" ||
				(statusFilter === "Resolved" ? entry.status === "Deleted" : entry.status === statusFilter);
			const matchesReason =
				reasonFilter === "All Reasons" || entry.reportReason === reasonFilter;
			const normalizedQuery = searchQuery.trim().toLowerCase();
			const matchesSearch =
				normalizedQuery.length === 0 ||
				entry.user.toLowerCase().includes(normalizedQuery) ||
				entry.comic.toLowerCase().includes(normalizedQuery) ||
				entry.comment.toLowerCase().includes(normalizedQuery);

			return matchesType && matchesStatus && matchesReason && matchesSearch;
		});
	}, [entries, reasonFilter, searchQuery, statusFilter, typeFilter]);

	function openDissolveModal(entry: (typeof initialEntries)[number]) {
		setEditingNoteEntry({
			...entry,
			status: "Dissolved",
			adminNote: entry.adminNote ?? "",
		});
	}

	function saveAdminNote() {
		if (!editingNoteEntry) return;

		setEntries((current) =>
			current.map((entry) =>
				entry.id === editingNoteEntry.id
					? {
						...entry,
						status: "Dissolved",
						adminNote: editingNoteEntry.adminNote,
					  }
					: entry,
			),
		);
		setEditingNoteEntry(null);
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
								Manage reviews & comments in one place.
							</h1>
						</div>
					</div>

					<div className="mt-6 space-y-3">
						<div className="grid gap-3 sm:grid-cols-2">
						<div className="rounded-2xl border border-[#ff018f]/25 bg-[#ff018f]/10 px-4 py-3">
							<p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#f6a1ff]">
								Total Reviews
							</p>
							<p className="mt-1 text-lg font-black text-white">{totalReviews}</p>
						</div>
						<div className="rounded-2xl border border-[#d9ccff]/20 bg-[#11012e]/80 px-4 py-3">
							<p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#d9ccff]">
								Total Comments
							</p>
							<p className="mt-1 text-lg font-black text-white">{totalComments}</p>
						</div>
						</div>
						<div className="grid gap-3 sm:grid-cols-3">
						<div className="rounded-2xl border border-[#d9ccff]/20 bg-[#11012e]/80 px-4 py-3">
							<p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#d9ccff]">
								Pending
							</p>
							<p className="mt-1 text-lg font-black text-white">{pendingCount}</p>
						</div>
						<div className="rounded-2xl border border-[#d9ccff]/20 bg-[#11012e]/80 px-4 py-3">
							<p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#d9ccff]">
								Deleted
							</p>
							<p className="mt-1 text-lg font-black text-white">{deletedCount}</p>
						</div>
						<div className="rounded-2xl border border-[#d9ccff]/20 bg-[#11012e]/80 px-4 py-3">
							<p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#d9ccff]">
								Dissolved
							</p>
							<p className="mt-1 text-lg font-black text-white">{dissolvedCount}</p>
						</div>
						</div>
					</div>

					<div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#11012e]/70">
						<div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
							<div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
								<select
									value={typeFilter}
									onChange={(event) => setTypeFilter(event.target.value)}
									className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
								>
									<option value="All">All</option>
									<option value="Review">Review</option>
									<option value="Comment">Comment</option>
								</select>
								<select
									value={statusFilter}
									onChange={(event) => setStatusFilter(event.target.value)}
									className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
								>
									<option value="All Statuses">All Statuses</option>
									<option value="Pending">Pending</option>
									<option value="Resolved">Resolved</option>
									<option value="Dissolved">Dissolved</option>
								</select>
								<select
									value={reasonFilter}
									onChange={(event) => setReasonFilter(event.target.value)}
									className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
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
									onChange={(event) => setSearchQuery(event.target.value)}
									placeholder="Search reviews or comments"
									className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
								/>
							</div>
						</div>

						<div className="divide-y divide-white/10">
							{filteredEntries.length === 0 && (
								<div className="px-5 py-10 text-center sm:px-6">
									<p className="text-sm font-semibold text-white/75">
										No review/comment found.
									</p>
									<p className="mt-2 text-sm text-white/45">
										Try changing the filters, reason, status, or search term.
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
											<span className="rounded-full border border-[#ff018f]/20 bg-[#ff018f]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[#f6a1ff]">
												{entry.status}
											</span>
											{entry.type === "Review" && (
												<span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[#d9ccff]">
													{entry.rating} stars
												</span>
											)}
											<span className="text-xs font-medium text-white/45">
												Title: {entry.comic}
											</span>
										</div>

										<div>
											<p className="text-sm font-semibold text-white/88">
												<span className="font-bold text-[#f6a1ff]">User:</span>{" "}
												{entry.user}
											</p>
											<p className="mt-2 text-sm text-white/66">
												<span className="font-bold text-[#f6a1ff]">
													{entry.type}:
												</span>{" "}
												{entry.comment}
											</p>
											<p className="mt-2 text-sm text-white/66">
												<span className="font-bold text-[#f6a1ff]">Report/Reason:</span>{" "}
												{entry.reportReason}
											</p>
											{entry.status === "Dissolved" && (
												<p className="mt-2 text-sm text-white/66">
													<span className="font-bold text-[#f6a1ff]">Admin Note:</span>{" "}
													{entry.adminNote ?? "No admin note."}
												</p>
											)}
										</div>
									</div>

									<div className="flex flex-wrap gap-2 lg:justify-end">
										{entry.status === "Pending" && (
											<>
												<button
													type="button"
													className="inline-flex h-11 items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 text-sm font-semibold text-white transition-colors hover:border-red-400/40 hover:bg-red-500/15"
												>
													<Trash2 className="h-4 w-4" />
													Delete
												</button>
												<button
													type="button"
													onClick={() => openDissolveModal(entry)}
													className="inline-flex h-11 items-center gap-2 rounded-full border border-[#f6a1ff]/25 bg-white/5 px-4 text-sm font-semibold text-white transition-colors hover:border-[#ff018f]/50 hover:bg-white/10"
												>
													Dissolved
												</button>
											</>
										)}
										{entry.status === "Dissolved" && (
											<>
												<button
													type="button"
													onClick={() => openDissolveModal(entry)}
													className="inline-flex h-11 items-center gap-2 rounded-full border border-[#f6a1ff]/25 bg-white/5 px-4 text-sm font-semibold text-white transition-colors hover:border-[#ff018f]/50 hover:bg-white/10"
												>
													Edit Admin Note
												</button>
												<button
													type="button"
													className="inline-flex h-11 items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 text-sm font-semibold text-white transition-colors hover:border-red-400/40 hover:bg-red-500/15"
												>
													<Trash2 className="h-4 w-4" />
													Delete
												</button>
											</>
										)}
									</div>
								</article>
							))}
						</div>
					</div>
				</section>

				{editingNoteEntry && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-6">
						<div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#120529]/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
							<div className="border-b border-white/10 pb-4">
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f6a1ff]">
										Admin Note
									</p>
									<h2 className="mt-2 text-2xl font-black text-white">{editingNoteEntry.type}</h2>
								</div>
							</div>

							<div className="mt-5 space-y-4">
								<div className="space-y-2 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/72">
									<p>
										<span className="font-bold text-[#f6a1ff]">User:</span>{" "}
										{editingNoteEntry.user}
									</p>
									<p>
										<span className="font-bold text-[#f6a1ff]">{editingNoteEntry.type}:</span>{" "}
										{editingNoteEntry.comment}
									</p>
									<p>
										<span className="font-bold text-[#f6a1ff]">Report/Reason:</span>{" "}
										{editingNoteEntry.reportReason}
									</p>
								</div>

								<label className="block">
									<span className="mb-2 block text-sm font-medium text-white/75">
										Admin Note
									</span>
									<textarea
										rows={5}
										value={editingNoteEntry.adminNote ?? ""}
										onChange={(event) =>
											setEditingNoteEntry((current) =>
												current
													? { ...current, adminNote: event.target.value }
													: current,
											)
										}
										className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
										placeholder="Explain why this item was dissolved..."
									/>
								</label>

								<div className="flex flex-wrap gap-3">
									<button
										type="button"
										onClick={() => setEditingNoteEntry(null)}
										className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition-colors hover:border-[#f6a1ff]/40 hover:bg-white/10"
									>
										Close
									</button>
									<button
										type="button"
										onClick={saveAdminNote}
										className="inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#ff018f_0%,#f6a1ff_100%)] px-5 text-sm font-black tracking-wide text-black shadow-[0_14px_32px_rgba(255,24,143,0.28)] transition-transform duration-200 hover:-translate-y-0.5"
									>
										Save
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
