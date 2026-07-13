"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen, Plus, Save, Sparkles, Tag, User } from "lucide-react";
import { featuredCovers } from "../../../../data/comic";

const coverOptions = featuredCovers.map((comic) => ({
	id: comic.id ?? comic.title.toLowerCase().replace(/\s+/g, "-"),
	title: comic.title,
	image: comic.image,
	type: comic.type,
	tag: comic.tag,
	description: comic.description ?? "No description provided yet.",
}));

const genreChoices = [
	"Action",
	"Fantasy",
	"Drama",
	"Romance",
	"Comedy",
	"Adventure",
	"Mystery",
	"Thriller",
];

export default function AdminComicEditPage() {
	const params = useParams<{ id?: string }>();
	const comicId = typeof params.id === "string" ? params.id : "";
	const matchedCover = coverOptions.find((cover) => cover.id === comicId);

	if (!matchedCover) {
		return (
			<main className="relative min-h-screen overflow-hidden bg-black text-white">
				<div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.96)_0%,rgba(17,1,46,0.92)_45%,rgba(0,0,0,0.99)_100%)]" />
				<div className="relative mx-auto max-w-4xl px-6 pb-12 pt-28 sm:px-10 lg:px-12">
					<section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
						<p className="text-sm font-semibold text-[#f6a1ff]">Comic not found</p>
						<p className="mt-3 text-white/70">This edit page needs a valid comic id in the URL.</p>
						<Link
							href="/admin/comics"
							className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#f6a1ff]/25 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-[#ff018f]/50 hover:bg-white/10"
						>
							<ArrowLeft className="h-4 w-4" />
							Back to comics
						</Link>
					</section>
				</div>
			</main>
		);
	}

	const [formData, setFormData] = useState({
		title: matchedCover.title,
		alternativeName: `Alternative title`,
		slug: matchedCover.id,
		author: "Fanmison / Luminara",
		status: "ONGOING",
		category: matchedCover.type,
		genres: ["Action", "Fantasy"],
		coverPhoto: matchedCover.image,
		synopsis: matchedCover.description,
	});

	const toggleGenre = (genre: string) => {
		setFormData((current) => {
			const hasGenre = current.genres.includes(genre);

			return {
				...current,
				genres: hasGenre
					? current.genres.filter((entry) => entry !== genre)
					: [...current.genres, genre],
			};
		});
	};

	return (
		<main className="relative min-h-screen overflow-hidden bg-black text-white">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,1,143,0.18),transparent_22%),radial-gradient(circle_at_75%_20%,rgba(45,12,98,0.34),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(246,161,255,0.14),transparent_24%)]" />
			<div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.96)_0%,rgba(17,1,46,0.92)_45%,rgba(0,0,0,0.99)_100%)]" />

			<div className="relative mx-auto max-w-7xl px-6 pb-12 pt-28 sm:px-10 lg:px-12">
				<div className="mb-6 flex items-center justify-between gap-4">
					<Link
						href="/admin/comics"
						className="inline-flex items-center gap-2 text-sm font-semibold text-white/65 transition-colors hover:text-[#f6a1ff]"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to comics
					</Link>
				</div>

				<section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_32px_120px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:p-8 lg:p-10">
					<div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
						<aside className="rounded-[1.75rem] border border-[#f6a1ff]/15 bg-[linear-gradient(180deg,rgba(17,1,46,0.92)_0%,rgba(0,0,0,0.82)_100%)] p-5 sm:p-6">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#fff7e0]">
									Edit Form
								</p>
								<h2 className="mt-2 text-2xl font-black text-white">
									Editing: {matchedCover.title}
								</h2>
							</div>

							<form className="mt-6 space-y-4">
								<label className="block">
									<span className="mb-2 block text-sm font-medium text-white/75">
										Comic title
									</span>
									<input
										value={formData.title}
										onChange={(event) =>
											setFormData((current) => ({
												...current,
												title: event.target.value,
											}))
										}
										className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
									/>
								</label>

								<label className="block">
									<span className="mb-2 block text-sm font-medium text-white/75">
										Alternative name
									</span>
									<input
										value={formData.alternativeName}
										onChange={(event) =>
											setFormData((current) => ({
												...current,
												alternativeName: event.target.value,
											}))
										}
										className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
									/>
								</label>

								<label className="block">
									<span className="mb-2 block text-sm font-medium text-white/75">
										Slug / route key
									</span>
									<input
										value={formData.slug}
										onChange={(event) =>
											setFormData((current) => ({
												...current,
												slug: event.target.value,
											}))
										}
										className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
									/>
								</label>

								<div className="grid gap-4 sm:grid-cols-2">
									<label className="block">
										<span className="mb-2 block text-sm font-medium text-white/75">
											Author
										</span>
										<input
											value={formData.author}
											onChange={(event) =>
												setFormData((current) => ({
													...current,
													author: event.target.value,
												}))
											}
											className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-[#ff018f] focus:ring-2 focus:ring-[#ff018f]/25"
										/>
									</label>

									<label className="block">
										<span className="mb-2 block text-sm font-medium text-white/75">
											Status
										</span>
										<select
											value={formData.status}
											onChange={(event) =>
												setFormData((current) => ({
													...current,
													status: event.target.value,
												}))
											}
											className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-[#ff018f] focus:ring-2 focus:ring-[#ff018f]/25"
										>
											<option value="ONGOING">ONGOING</option>
											<option value="COMPLETED">COMPLETED</option>
											<option value="HIATUS">HIATUS</option>
											<option value="COMING_SOON">COMING_SOON</option>
										</select>
									</label>
								</div>

								<div className="grid gap-4 sm:grid-cols-2">
									<label className="block">
										<span className="mb-2 block text-sm font-medium text-white/75">
											Category
										</span>
										<select
											value={formData.category}
											onChange={(event) =>
												setFormData((current) => ({
													...current,
													category: event.target.value as
														| "Manhwa"
														| "Manga"
														| "Manhua"
														| "Webcomics",
												}))
											}
											className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
										>
											<option value="Manhwa">Manhwa</option>
											<option value="Manga">Manga</option>
											<option value="Manhua">Manhua</option>
											<option value="Webcomics">Webcomics</option>
										</select>
									</label>

									<label className="block">
										<span className="mb-2 block text-sm font-medium text-white/75">
											Status
										</span>
										<select
											value={formData.status}
											onChange={(event) =>
												setFormData((current) => ({
													...current,
													status: event.target.value,
												}))
											}
											className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
										>
											<option value="ONGOING">ONGOING</option>
											<option value="COMPLETED">COMPLETED</option>
											<option value="HIATUS">HIATUS</option>
											<option value="COMING_SOON">COMING_SOON</option>
										</select>
									</label>
								</div>

								<div>
									<span className="mb-2 block text-sm font-medium text-white/75">
										Genres
									</span>
									<div className="flex flex-wrap gap-2">
										{genreChoices.map((genre) => {
											const active = formData.genres.includes(genre);

											return (
												<button
													key={genre}
													type="button"
													onClick={() => toggleGenre(genre)}
													className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] transition ${
														active
															? "border-[#ff018f]/40 bg-[#ff018f]/15 text-white"
															: "border-white/10 bg-white/5 text-white/60 hover:border-[#f6a1ff]/40 hover:text-white"
													}`}
												>
													{genre}
												</button>
											);
										})}
									</div>
								</div>

								<label className="block">
									<span className="mb-2 block text-sm font-medium text-white/75">
										Synopsis
									</span>
									<textarea
										value={formData.synopsis}
										onChange={(event) =>
											setFormData((current) => ({
												...current,
												synopsis: event.target.value,
											}))
										}
										rows={6}
										className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#ff018f] focus:ring-2 focus:ring-[#ff018f]/25"
										placeholder="Write the comic description..."
									/>
								</label>

								<label className="block">
									<span className="mb-2 block text-sm font-medium text-white/75">
										Cover photo URL
									</span>
									<input
										value={formData.coverPhoto}
										onChange={(event) =>
											setFormData((current) => ({
												...current,
												coverPhoto: event.target.value,
											}))
										}
										className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
										placeholder="/images/covers/YourComic.jpg"
									/>
								</label>

								<div className="grid gap-3 pt-2 sm:grid-cols-2">
									<button
										type="button"
										className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#ff018f_0%,#f6a1ff_100%)] px-5 text-sm font-black tracking-wide text-black shadow-[0_14px_32px_rgba(255,24,143,0.28)] transition-transform duration-200 hover:-translate-y-0.5"
									>
										<Plus className="h-4 w-4" />
										Save changes
									</button>
									<button
										type="button"
										className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition-colors hover:border-[#f6a1ff]/40 hover:bg-white/10"
									>
										<Save className="h-4 w-4" />
										Save draft
									</button>
								</div>
							</form>
						</aside>

						<div className="rounded-[1.75rem] border border-white/10 bg-[#11012e]/75 p-5 sm:p-6">
							<div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f6a1ff]">
										Live Preview
									</p>
									<h2 className="mt-2 text-2xl font-black text-white">
										Public comic-page feel
									</h2>
								</div>
								<span className="rounded-full border border-[#d9ccff]/20 bg-[#d9ccff]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.3em] text-[#d9ccff]">
									{formData.status}
								</span>
							</div>

							<div className="mt-5 grid gap-5 md:grid-cols-[220px_1fr]">
								<div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black shadow-[0_15px_40px_rgba(0,0,0,0.45)]">
									<div className="relative aspect-[3/4]">
										<Image
											src={formData.coverPhoto}
											alt={formData.title}
											fill
											className="object-cover"
											sizes="220px"
										/>
									</div>
								</div>

								<div>
									<p className="text-xs font-medium tracking-wide text-white/40">
										{formData.title} / Alternative Titles
									</p>
									<h3 className="mt-1 text-2xl font-black tracking-tight text-white">
										{formData.title}
									</h3>
									<p className="mt-2 text-sm text-white/55">
										Alternative title: {formData.alternativeName}
									</p>
									<p className="mt-5 text-sm leading-7 text-white/68">
										{formData.synopsis}
									</p>
								</div>
							</div>

							<div className="mt-5 grid gap-3 md:grid-cols-3">
								<div className="rounded-2xl border border-white/10 bg-black/30 p-3">
									<div className="flex items-center gap-2 text-white/45">
										<Sparkles className="h-3.5 w-3.5" />
										<span className="text-[10px] font-bold uppercase tracking-[0.28em]">
											Status
										</span>
									</div>
									<p className="mt-2 text-sm font-black text-white">{formData.status}</p>
								</div>
								<div className="rounded-2xl border border-white/10 bg-black/30 p-3">
									<div className="flex items-center gap-2 text-white/45">
										<User className="h-3.5 w-3.5" />
										<span className="text-[10px] font-bold uppercase tracking-[0.28em]">
											Author
										</span>
									</div>
									<p className="mt-2 text-sm font-black text-white">{formData.author}</p>
								</div>
								<div className="rounded-2xl border border-white/10 bg-black/30 p-3">
									<div className="flex items-center gap-2 text-white/45">
										<BookOpen className="h-3.5 w-3.5" />
										<span className="text-[10px] font-bold uppercase tracking-[0.28em]">
											Type
										</span>
									</div>
									<p className="mt-2 text-sm font-black text-white">{formData.category}</p>
								</div>
							</div>

							<div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
								<div className="mb-2 flex items-center gap-2 text-white/45">
									<Tag className="h-3.5 w-3.5" />
									<span className="text-[10px] font-bold uppercase tracking-[0.28em]">
										Genres
									</span>
								</div>
								<div className="flex flex-wrap gap-2">
									{formData.genres.map((genre) => (
										<span
											key={genre}
											className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[#d9ccff]"
										>
											{genre}
										</span>
									))}
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}