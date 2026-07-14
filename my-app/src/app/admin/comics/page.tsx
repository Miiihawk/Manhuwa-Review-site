import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Edit3, Eye, Plus, Trash2 } from "lucide-react";
import { featuredCovers } from "../../data/comic";

const comics = featuredCovers.map((comic, index) => ({
	...comic,
	status: index === 0 ? "Published" : index === 1 ? "Draft" : "Review",
	updatedAt: index === 0 ? "2 hours ago" : index === 1 ? "Today" : "Yesterday",
}));

export default async function AdminComicsPage({
	searchParams,
}: {
	searchParams?: Promise<{ q?: string }>;
}) {
	const resolvedSearchParams = (await searchParams) ?? {};
	const query = resolvedSearchParams.q?.trim().toLowerCase() ?? "";
	const filteredComics = comics.filter((comic) =>
		comic.title.toLowerCase().includes(query),
	);

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
								Comic Management
							</p>
							<h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
								Manage comics in one place.
							</h1>
						</div>

						<div className="flex flex-wrap items-center gap-3 lg:justify-end">
							<Link
								href="/admin/comics/create"
								className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#ff018f_0%,#f6a1ff_100%)] px-5 text-sm font-black tracking-wide text-black shadow-[0_14px_32px_rgba(255,24,143,0.3)] transition-transform duration-200 hover:-translate-y-0.5"
							>
								<Plus className="h-4 w-4" />
								Add comic
							</Link>

							<div className="rounded-2xl border border-[#ff018f]/25 bg-[#ff018f]/10 px-4 py-3">
								<p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#f6a1ff]">
									Total Comics
								</p>
								<p className="mt-1 text-lg font-black text-white">{filteredComics.length}</p>
							</div>
						</div>
					</div>

					<div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#11012e]/70">
						<div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f6a1ff]">
									Catalog List
								</p>
								<h2 className="mt-2 text-2xl font-black text-white">Current comics</h2>
							</div>
							<form action="" className="w-full max-w-sm">
								<input
									type="search"
									name="q"
									defaultValue={resolvedSearchParams.q ?? ""}
									placeholder="Search comic titles"
									className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
								/>
							</form>
						</div>

						<div className="divide-y divide-white/10">
							{filteredComics.map((comic) => (
								<article
									key={comic.id}
									className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[120px_1fr_auto] lg:items-center"
								>
									<div className="relative h-44 overflow-hidden rounded-2xl border border-white/10 bg-black sm:h-36">
										<Image
											src={comic.image}
											alt={comic.title}
											fill
											className="object-cover"
											sizes="120px"
										/>
									</div>

									<div className="space-y-3">
										<div className="flex flex-wrap items-center gap-2">
											<span className="rounded-full border border-[#ff018f]/20 bg-[#ff018f]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[#f6a1ff]">
												{comic.status}
											</span>
											<span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[#d9ccff]">
												{comic.type}
											</span>
											<span className="text-xs font-medium text-white/45">
												Updated {comic.updatedAt}
											</span>
										</div>

										<div>
											<h3 className="text-2xl font-black text-white">{comic.title}</h3>
											<p className="mt-2 max-w-2xl text-sm leading-6 text-white/66">
												{comic.description}
											</p>
										</div>
									</div>

									<div className="flex flex-wrap gap-2 lg:justify-end">
										<Link
											href={`/comic/${comic.id}`}
											className="inline-flex h-11 items-center gap-2 rounded-full border border-[#fff7e0]/20 bg-[#fff7e0]/10 px-4 text-sm font-semibold text-white transition-colors hover:border-[#fff7e0]/40 hover:bg-[#fff7e0]/15"
										>
											<Eye className="h-4 w-4" />
											View
										</Link>
										<Link
											href={`/admin/comics/${comic.id}/edit`}
											className="inline-flex h-11 items-center gap-2 rounded-full border border-[#f6a1ff]/25 bg-white/5 px-4 text-sm font-semibold text-white transition-colors hover:border-[#ff018f]/50 hover:bg-white/10"
										>
											<Edit3 className="h-4 w-4" />
											Edit
										</Link>
										<button
											type="button"
											className="inline-flex h-11 items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 text-sm font-semibold text-white transition-colors hover:border-red-400/40 hover:bg-red-500/15"
										>
											<Trash2 className="h-4 w-4" />
											Delete
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
