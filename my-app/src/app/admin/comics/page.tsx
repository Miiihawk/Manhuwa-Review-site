import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { comicService } from "@/app/lib/services/comic.service";
import ComicListClient from "./comic-list-client";
import type { AdminComicRow } from "./comic-types";

export const dynamic = "force-dynamic";

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, " ");
}

export default async function AdminComicsPage({
  searchParams,
}: {
  searchParams?: { q?: string; category?: string; status?: string };
}) {
  const resolvedSearchParams = searchParams ?? {};

  let comics: AdminComicRow[] = [];

  try {
    const rows = await comicService.listComics();
    comics = rows.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      image: c.coverPhoto,
      description: c.synopsis,
      status: formatStatus(c.publicationStatus),
      type: c.category?.name ?? "Uncategorized",
      updatedAt: new Date(c.updatedAt).toLocaleDateString(),
    }));
  } catch (error) {
    console.error("Admin comics: failed to load:", error);
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
          <div className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#f6a1ff]">
                Comic Management
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Manage comics in one place.
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
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
                <p className="mt-1 text-lg font-black text-white">{comics.length}</p>
              </div>
            </div>
          </div>

          <ComicListClient
            comics={comics}
            initialQuery={resolvedSearchParams.q ?? ""}
            initialCategory={resolvedSearchParams.category ?? "ALL"}
            initialStatus={resolvedSearchParams.status ?? "ALL"}
          />
        </section>
      </div>
    </main>
  );
}
