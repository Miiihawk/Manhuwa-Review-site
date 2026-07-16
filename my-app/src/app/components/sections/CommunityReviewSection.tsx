import Link from "next/link";
import { reviewService } from "@/app/lib/services/review.service";

export default async function CommunityReviewSection() {
  let reviews: {
    id: number;
    rating: number;
    review: string | null;
    user: { username: string; profilePic: string | null };
    comic: { title: string; slug: string };
  }[] = [];

  try {
    reviews = await reviewService.listRecentReviews(3);
  } catch (error) {
    console.error("Error fetching community reviews:", error);
  }

  if (reviews.length === 0) return null;

  return (
    <section className="w-full">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.4em] text-[#f6a1ff]/90">
          Reader Thoughts
        </p>
        <h2 className="mt-2 text-2xl font-black flex items-center gap-2">
          Community Reviews
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex flex-col justify-between rounded-2xl bg-white/5 border border-white/5 p-6 transition duration-300 hover:border-white/10 hover:bg-white/[0.07]"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="text-amber-400 text-sm tracking-wider">
                  {"⭐".repeat(Math.max(0, review.rating))}
                </div>
                <Link
                  href={`/${review.comic.slug}`}
                  className="text-[10px] font-black uppercase tracking-wider text-white/40 line-clamp-1 max-w-[150px] hover:text-pink-400 transition-colors"
                >
                  {review.comic.title}
                </Link>
              </div>

              <p className="mt-4 text-sm text-white/70 leading-relaxed italic">
                &quot;{review.review}&quot;
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/5">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-pink-500 flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-md">
                {review.user.profilePic ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={review.user.profilePic}
                    alt={review.user.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  review.user.username.substring(0, 2).toUpperCase()
                )}
              </div>
              <span className="text-xs font-bold tracking-wide text-pink-400">
                — {review.user.username}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
