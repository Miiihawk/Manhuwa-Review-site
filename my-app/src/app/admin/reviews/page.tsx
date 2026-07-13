import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";

const reviews = [
	{
		id: 1,
		comic: "Debut or Die",
		user: "Ari Valen",
		rating: "5.0",
		status: "Approved",
		comment: "Strong start, great pacing, and the art direction is consistent.",
	},
	{
		id: 2,
		comic: "Life of a Quack Healer",
		user: "Mika Sol",
		rating: "4.5",
		status: "Approved",
		comment: "Funny and energetic. The supporting cast carries the charm well.",
	},
	{
		id: 3,
		comic: "The Ultimate Shut In",
		user: "Jae Kim",
		rating: "2.0",
		status: "Flagged",
		comment: "Contains spammy language and should be reviewed for moderation.",
	},
	{
		id: 4,
		comic: "Return of The Mad Demon",
		user: "Nora Lin",
		rating: "4.8",
		status: "Approved",
		comment: "Fast and fun. The main character stands out immediately.",
	},
];

export default function AdminReviewsPage() {
	return (
		<main className="relative min-h-screen overflow-hidden bg-black text-white">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,1,143,0.16),transparent_24%),radial-gradient(circle_at_75%_20%,rgba(45,12,98,0.35),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(246,161,255,0.12),transparent_26%)]" />
			<div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.96)_0%,rgba(17,1,46,0.94)_45%,rgba(0,0,0,0.98)_100%)]" />

			<div className="relative mx-auto max-w-7xl px-6 pb-10 pt-28 sm:px-10 lg:px-12">
				<div className="mb-6 flex items-center justify-between gap-4">
					<Link
						href="/admin/dashboard"
						className="inline-flex items-center gap-2 text-sm font-semibold text-white/65 transition-colors hover:text-[#f6a1ff]"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to dashboard
					</Link>
				</div>

				<section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_32px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-8 lg:p-10">
					<div className="flex flex-col gap-5 border-b border-white/10 pb-6">
						<div className="max-w-2xl">
							<p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#f6a1ff]">
								Review Management
							</p>
							<h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
								Manage reviews in one place.
							</h1>
						</div>
					</div>

					<div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
						<div className="rounded-2xl border border-[#ff018f]/25 bg-[#ff018f]/10 px-4 py-3">
							<p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#f6a1ff]">
								Total Reviews
							</p>
							<p className="mt-1 text-lg font-black text-white">{reviews.length}</p>
						</div>
						<div className="rounded-2xl border border-[#d9ccff]/20 bg-[#11012e]/80 px-4 py-3">
							<p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#d9ccff]">
								Approved
							</p>
							<p className="mt-1 text-lg font-black text-white">3</p>
						</div>
						<div className="rounded-2xl border border-[#d9ccff]/20 bg-[#11012e]/80 px-4 py-3">
							<p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#d9ccff]">
								Flagged
							</p>
							<p className="mt-1 text-lg font-black text-white">1</p>
						</div>
						<div className="rounded-2xl border border-[#d9ccff]/20 bg-[#11012e]/80 px-4 py-3">
							<p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#d9ccff]">
								Users
							</p>
							<p className="mt-1 text-lg font-black text-white">4</p>
						</div>
					</div>

					<div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#11012e]/70">
						<div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
							<div>
								<h2 className="text-xs font-semibold text-white/55">All Reviews</h2>
							</div>
						</div>

						<div className="divide-y divide-white/10">
							{reviews.map((review) => (
								<article
									key={review.id}
									className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center"
								>
									<div className="space-y-3">
										<div className="flex flex-wrap items-center gap-2">
											<span className="rounded-full border border-[#ff018f]/20 bg-[#ff018f]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[#f6a1ff]">
												{review.status}
											</span>
											<span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[#d9ccff]">
												{review.rating} stars
											</span>
											<span className="text-xs font-medium text-white/45">{review.comic}</span>
										</div>

										<div>
											<h3 className="text-2xl font-black text-white">{review.user}</h3>
											<p className="mt-1 text-sm text-white/66">{review.comment}</p>
										</div>
									</div>

									<div className="flex flex-wrap gap-2 lg:justify-end">
										<button
											type="button"
											className="inline-flex h-11 items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 text-sm font-semibold text-white transition-colors hover:border-red-400/40 hover:bg-red-500/15"
										>
											<Trash2 className="h-4 w-4" />
											Delete inappropriate review
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
