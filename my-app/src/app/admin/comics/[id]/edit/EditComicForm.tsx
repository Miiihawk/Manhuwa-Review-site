"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { slugify, normalizeSlugInput } from "@/app/lib/slug";
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Save,
  Sparkles,
  Tag,
  User,
} from "lucide-react";

interface EditComicFormProps {
  comic: {
    id: number;
    title: string;
    alternativeName: string;
    slug: string;
    author: string;
    status: string;
    category: string;
    genres: string[];
    coverPhoto: string;
    synopsis: string;
    officialLegalPlatforms: string[];
  };
}

export default function EditComicForm({ comic }: EditComicFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: comic.title,
    alternativeName: comic.alternativeName,
    slug: comic.slug,
    author: comic.author,
    status: comic.status,
    category: comic.category,
    genres: comic.genres,
    coverPhoto: comic.coverPhoto,
    synopsis: comic.synopsis,
  });
  const [officialLegalPlatforms, setOfficialLegalPlatforms] = useState<string[]>(
    comic.officialLegalPlatforms && comic.officialLegalPlatforms.length > 0
      ? comic.officialLegalPlatforms.slice(0, 4)
      : [""],
  );

  const [genreChoices, setGenreChoices] = useState<string[]>([]);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    async function loadGenres() {
      try {
        const res = await fetch("/api/genres");
        if (!res.ok) return;
        const data = await res.json();
        setGenreChoices(data.map((g: { name: string }) => g.name));
      } catch (error) {
        console.error("Failed to load genres:", error);
      }
    }
    loadGenres();
  }, []);

  const toggleGenre = (genre: string) => {
    setFormData((current) => {
      const has = current.genres.includes(genre);
      return {
        ...current,
        genres: has
          ? current.genres.filter((g) => g !== genre)
          : [...current.genres, genre],
      };
    });
  };

  const addMoreLinks = () => {
    setOfficialLegalPlatforms((current) =>
      current.length >= 4 ? current : [...current, ""],
    );
  };

  const updateLegalPlatform = (index: number, value: string) => {
    setOfficialLegalPlatforms((current) =>
      current.map((entry, entryIndex) => (entryIndex === index ? value : entry)),
    );
  };

  async function handleCoverUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Upload failed");
        return;
      }

      const data = await res.json();
      setFormData((current) => ({ ...current, coverPhoto: data.url }));
    } catch (error) {
      console.error("Cover upload failed:", error);
      alert("Upload failed — check your connection.");
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/comics/${comic.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          alternativeName: formData.alternativeName,
          slug: formData.slug,
          synopsis: formData.synopsis,
          coverPhoto: formData.coverPhoto,
          author: formData.author,
          category: formData.category,
          publicationStatus: formData.status,
          genres: formData.genres,
          officialLegalPlatforms,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Could not save changes.");
        return;
      }

      router.push("/admin/comics");
      router.refresh();
    } catch (error) {
      console.error("Save comic failed:", error);
      alert("Could not save — check your connection.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25";

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

        <section>
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <aside className="rounded-[1.75rem] border border-[#f6a1ff]/15 bg-[linear-gradient(180deg,rgba(17,1,46,0.92)_0%,rgba(0,0,0,0.82)_100%)] p-5 sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#fff7e0]">
                  Edit Comic
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  Edit the comic record
                </h2>
              </div>

              <form className="mt-6 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/75">
                    Comic title
                  </span>
                  <input
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData((c) => ({
                        ...c,
                        title,
                        slug: slugEdited ? c.slug : slugify(title),
                      }));
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
                    placeholder="Enter comic title"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/75">
                    Alternative name
                  </span>
                  <input
                    value={formData.alternativeName}
                    onChange={(e) =>
                      setFormData((c) => ({
                        ...c,
                        alternativeName: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
                    placeholder="Optional alternative title"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/75">
                    Slug / route key
                  </span>
                  <input
                    value={formData.slug}
                    onChange={(e) => {
                      setSlugEdited(true);
                      setFormData((c) => ({
                        ...c,
                        slug: normalizeSlugInput(e.target.value),
                      }));
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
                    placeholder="debut-or-die"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/75">
                    Author
                  </span>
                  <input
                    value={formData.author}
                    onChange={(e) =>
                      setFormData((c) => ({ ...c, author: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-[#ff018f] focus:ring-2 focus:ring-[#ff018f]/25"
                    placeholder="Enter author name"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-white/75">
                      Category
                    </span>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((c) => ({ ...c, category: e.target.value }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
                    >
                      <option value="">Select category</option>
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
                      onChange={(e) =>
                        setFormData((c) => ({ ...c, status: e.target.value }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
                    >
                      <option value="">Select status</option>
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
                    {genreChoices.length > 0 ? (
                      genreChoices.map((genre) => {
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
                      })
                    ) : (
                      <p className="text-xs text-white/40">
                        No genres yet — add some in Genre Management first.
                      </p>
                    )}
                  </div>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/75">
                    Synopsis
                  </span>
                  <textarea
                    value={formData.synopsis}
                    onChange={(e) =>
                      setFormData((c) => ({ ...c, synopsis: e.target.value }))
                    }
                    rows={6}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#ff018f] focus:ring-2 focus:ring-[#ff018f]/25"
                    placeholder="Write the comic description..."
                  />
                </label>

                <div className="space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white/75">
                        Official Legal Platforms
                      </p>
                      <p className="mt-1 text-xs text-white/45">
                        Paste up to four official reading links.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addMoreLinks}
                      disabled={officialLegalPlatforms.length >= 4}
                      className="inline-flex h-10 items-center justify-center rounded-full border border-[#f6a1ff]/25 bg-white/5 px-4 text-xs font-semibold text-white transition-colors hover:border-[#ff018f]/50 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Add More Links
                    </button>
                  </div>

                  <div className="space-y-3">
                    {officialLegalPlatforms.map((link, index) => (
                      <input
                        key={index}
                        type="url"
                        value={link}
                        onChange={(event) => updateLegalPlatform(index, event.target.value)}
                        placeholder="Paste official platform link here"
                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
                      />
                    ))}
                  </div>
                </div>

                {/* ★ NEW (c): file upload + manual URL fallback */}
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/75">
                    Cover photo
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    disabled={uploadingCover}
                    className="block w-full text-sm text-white/70 file:mr-3 file:rounded-full file:border-0 file:bg-[#ff018f] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:brightness-110"
                  />
                  {uploadingCover && (
                    <p className="mt-2 text-sm text-white/50">Uploading…</p>
                  )}

                  <input
                    value={formData.coverPhoto}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        coverPhoto: event.target.value,
                      }))
                    }
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
                    placeholder="/uploads/... or /images/covers/YourComic.jpg"
                  />
                </label>

                <div className="grid gap-3 pt-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#ff018f_0%,#f6a1ff_100%)] px-5 text-sm font-black tracking-wide text-black shadow-[0_14px_32px_rgba(255,24,143,0.28)] transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {saving ? "Saving…" : "Edit comic"}
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
                  {formData.coverPhoto ? (
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={formData.coverPhoto}
                        alt={formData.title}
                        fill
                        className="object-cover"
                        sizes="144px"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[3/4] items-center justify-center bg-[linear-gradient(180deg,rgba(17,1,46,0.9)_0%,rgba(0,0,0,0.95)_100%)] px-6 text-center">
                      <p className="text-sm font-medium text-white/45">
                        No cover selected yet
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs font-medium tracking-wide text-white/40">
                    {formData.title || "New comic"} / Alternative Titles
                  </p>
                  <h3 className="mt-1 text-2xl font-black tracking-tight text-white">
                    {formData.title || "Untitled comic"}
                  </h3>
                  <p className="mt-2 text-sm text-white/55">
                    Alternative title:{" "}
                    {formData.alternativeName || "Not set yet"}
                  </p>
                  <p className="mt-5 text-sm leading-7 text-white/68">
                    {formData.synopsis || "No synopsis written yet."}
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
                  <p className="mt-2 text-sm font-black text-white">
                    {formData.status}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                  <div className="flex items-center gap-2 text-white/45">
                    <User className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.28em]">
                      Author
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-black text-white">
                    {formData.author}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                  <div className="flex items-center gap-2 text-white/45">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.28em]">
                      Type
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-black text-white">
                    {formData.category}
                  </p>
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
