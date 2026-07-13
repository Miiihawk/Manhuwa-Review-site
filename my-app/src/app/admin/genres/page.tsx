import Link from "next/link";
import { ArrowLeft, Edit3, Plus, Trash2 } from "lucide-react";

const genres = [
	{ id: 1, name: "Action", count: 38 },
	{ id: 2, name: "Fantasy", count: 24 },
	{ id: 3, name: "Drama", count: 16 },
	{ id: 4, name: "Romance", count: 12 },
	{ id: 5, name: "Mystery", count: 9 },
];

export default function AdminGenresPage() {
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
					<div className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
							<p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#f6a1ff]">
								Genre Management
							</p>
							<h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
								Manage genres in one place.
							</h1>
						</div>

						<div className="rounded-2xl border border-[#ff018f]/25 bg-[#ff018f]/10 px-4 py-3">
							<p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#f6a1ff]">
								Total Genres
							</p>
							<p className="mt-1 text-lg font-black text-white">{genres.length}</p>
						</div>
					</div>

					<div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
						<div className="overflow-hidden rounded-3xl border border-white/10 bg-[#11012e]/70">
							<div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
								<div>
									<h2 className="text-2xl font-black text-white">All genres</h2>
								</div>
							</div>

							<div className="divide-y divide-white/10">
								{genres.map((genre) => (
									<article
										key={genre.id}
										className="flex flex-col gap-4 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between"
									>
										<div>
											<p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f6a1ff]">
												Genre
											</p>
											<h3 className="mt-2 text-2xl font-black text-white">{genre.name}</h3>
											<p className="mt-1 text-sm text-white/55">Used in {genre.count} comics</p>
										</div>

										<div className="flex flex-wrap gap-2 lg:justify-end">
											<button
												type="button"
												className="inline-flex h-11 items-center gap-2 rounded-full border border-[#f6a1ff]/25 bg-white/5 px-4 text-sm font-semibold text-white transition-colors hover:border-[#ff018f]/50 hover:bg-white/10"
											>
												<Edit3 className="h-4 w-4" />
												Edit genre
											</button>
											<button
												type="button"
												className="inline-flex h-11 items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 text-sm font-semibold text-white transition-colors hover:border-red-400/40 hover:bg-red-500/15"
											>
												<Trash2 className="h-4 w-4" />
												Delete genre
											</button>
										</div>
									</article>
								))}
							</div>
						</div>

						<div className="rounded-3xl border border-white/10 bg-[#11012e]/70 p-5 sm:p-6">
							<h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f6a1ff]">
								Add genre
							</h2>

							<form className="mt-5 space-y-4">
								<input
									type="text"
									placeholder="Genre name"
									className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
								/>
								<textarea
									rows={4}
									placeholder="Genre description"
									className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
								/>
								<button
									type="button"
									className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#ff018f_0%,#f6a1ff_100%)] px-5 text-sm font-black tracking-wide text-black shadow-[0_14px_32px_rgba(255,24,143,0.28)] transition-transform duration-200 hover:-translate-y-0.5"
								>
									<Plus className="h-4 w-4" />
									Add genre
								</button>
							</form>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}
