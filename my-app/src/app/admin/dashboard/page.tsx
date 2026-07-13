import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Heart, Sparkles, Users } from "lucide-react";
import { featuredCovers } from "../../data/comic";

const dashboardStats = [
	{
		label: "Total Users",
		value: "12.4K",
		hint: "+8.2% this week",
		icon: Users,
	},
	{
		label: "Total Comics",
		value: "286",
		hint: `${featuredCovers.length} newly highlighted`,
		icon: BookOpen,
	},
	{
		label: "Total Reviews",
		value: "48.9K",
		hint: "+1.6K since yesterday",
		icon: Sparkles,
	},
	{
		label: "Total Favorites",
		value: "91.3K",
		hint: "+4.1K saved this month",
		icon: Heart,
	},
];

const recentComics = featuredCovers.slice(0, 4);

export default function AdminDashboardPage() {
	return (
		<main className="relative min-h-screen overflow-hidden bg-black text-white">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,1,143,0.18),transparent_24%),radial-gradient(circle_at_70%_20%,rgba(45,12,98,0.35),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(246,161,255,0.18),transparent_26%)]" />
			<div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.96)_0%,rgba(17,1,46,0.94)_45%,rgba(0,0,0,0.98)_100%)]" />

			<div className="relative mx-auto max-w-7xl px-6 pb-10 pt-28 sm:px-10 lg:px-12">
				<section>
					<div className="flex flex-col gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
							<p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#f6a1ff]">
								Admin Dashboard
							</p>
							<h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
								Welcome admin_name.
							</h1>
						</div>

						<div className="grid gap-3 sm:grid-cols-2">
							<div className="rounded-2xl border border-[#ff018f]/25 bg-[#ff018f]/10 px-4 py-3">
								<p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#f6a1ff]">
									Status
								</p>
								<p className="mt-1 text-lg font-black text-white">All systems live</p>
							</div>
							<div className="rounded-2xl border border-[#d9ccff]/20 bg-[#11012e]/80 px-4 py-3">
								<p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#d9ccff]">
									Review Queue
								</p>
								<p className="mt-1 text-lg font-black text-white">14 pending items</p>
							</div>
						</div>
					</div>

					<section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
						{dashboardStats.map(({ label, value, hint, icon: Icon }) => (
							<article
								key={label}
								className="group rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(17,1,46,0.92)_0%,rgba(0,0,0,0.84)_100%)] p-5 transition-transform duration-200 hover:-translate-y-1"
							>
								<div className="flex items-start justify-between gap-4">
									<div>
										<p className="text-sm font-medium text-white/64">{label}</p>
										<p className="mt-3 text-4xl font-black tracking-tight text-white">{value}</p>
									</div>
									<div className="rounded-2xl border border-[#ff018f]/20 bg-[#ff018f]/10 p-3 text-[#f6a1ff] shadow-[0_0_30px_rgba(255,1,143,0.08)]">
										<Icon className="h-5 w-5" />
									</div>
								</div>
								<p className="mt-4 text-sm font-medium text-[#d9ccff]">{hint}</p>
								<div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
									<div className="h-full w-2/3 rounded-full bg-[linear-gradient(90deg,#ff018f_0%,#f6a1ff_50%,#d9ccff_100%)] transition-all duration-300 group-hover:w-[78%]" />
								</div>
							</article>
						))}
					</section>

					<section className="mt-8">
						<div className="w-full rounded-3xl border border-white/10 bg-[#11012e]/70 p-5 sm:p-6">
							<div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f6a1ff]">
										Recently Added Comics
									</p>
									<h2 className="mt-2 text-2xl font-black text-white">
										Fresh titles in the catalog
									</h2>
								</div>
							</div>

							<div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
								{recentComics.map((comic) => (
									<article
										key={comic.id}
										className="group overflow-hidden rounded-3xl border border-white/10 bg-black/35 transition-transform duration-200 hover:-translate-y-1"
									>
										<div className="relative h-56 overflow-hidden bg-[#000000]">
											<Image
												src={comic.image}
												alt={comic.title}
												fill
												className="object-cover transition-transform duration-300 group-hover:scale-105"
												sizes="(max-width: 768px) 100vw, 50vw"
											/>
											<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.82)_100%)]" />
											<div className="absolute left-4 top-4 rounded-full border border-[#f6a1ff]/30 bg-black/50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.3em] text-[#f6a1ff]">
												{comic.type}
											</div>
										</div>
										<div className="space-y-3 p-4">
											<div className="flex items-center justify-between gap-4">
												<h3 className="text-lg font-black text-white">{comic.title}</h3>
											</div>
											<p className="text-sm leading-6 text-white/65">
												{comic.description}
											</p>
											<div className="flex items-center justify-end border-t border-white/10 pt-3">
												<Link
													href={`/comic/${comic.id}`}
													className="inline-flex items-center gap-2 rounded-full border border-[#fff7e0]/25 bg-[#fff7e0]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#fff7e0] transition-colors hover:border-[#fff7e0]/45 hover:bg-[#fff7e0]/15"
												>
													Visit Page
													<ArrowUpRight className="h-3.5 w-3.5" />
												</Link>
											</div>
										</div>
									</article>
								))}
							</div>
						</div>
					</section>
				</section>
			</div>
		</main>
	);
}
