import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, MessageSquareQuote, ExternalLink } from "lucide-react";
import { auth } from "@/app/lib/auth";
import { reviewService } from "@/app/lib/services/review.service";
import { timeAgo } from "@/app/lib/timeAgo";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const reviews = await reviewService.listForUser(Number(session.user.id));

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,1,143,0.12),transparent_30%),radial-gradient(circle_at_70%_20%,rgba(45,12,98,0.2),transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.98)_0%,rgba(11,2,26,0.95)_50%,rgba(0,0,0,1)_100%)]" />

      <div className="relative mx-auto max-w-5xl px-6 pt-28 pb-16 sm:px-10 lg:px-12 z-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-[#f6a1ff] mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>

        <section className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2.5">
            <MessageSquareQuote className="h-5 w-5 text-[#f6a1ff]" />
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#f6a1ff]/90">
              Reviews
            </p>
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
            Your Reviews
          </h1>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-white/65 leading-relaxed">
            Track the ratings and comments you have published across the
            library. You have written {reviews.length} review
            {reviews.length === 1 ? "" : "s"}.
          </p>
        </section>

        {reviews.length > 0 ? (
          <div className="mt-8 space-y-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-amber-400 text-sm tracking-wider">
                      {"⭐".repeat(Math.max(0, review.rating))}
                    </div>
                    <h2 className="mt-2 text-lg font-bold tracking-tight text-white">
                      {review.comic.title}
                    </h2>
                    <p className="mt-2 text-sm text-white/65 leading-relaxed">
                      {review.review || "No written review provided."}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:text-right">
                    <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.35em] text-white/60">
                      {review.comic.publicationStatus}
                    </span>
                    <span className="text-xs text-white/40">
                      {timeAgo(review.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
                  <Link
                    href={`/${review.comic.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#ff018f] hover:border-[#ff018f]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open comic
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-white/[0.01] py-20 text-center">
            <p className="text-sm text-white/40">
              You have not posted any reviews yet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
