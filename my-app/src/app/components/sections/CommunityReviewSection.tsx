// src/app/components/sections/CommunityReviewSection.tsx

interface ReviewItem {
  id: string;
  comicTitle: string;
  rating: number;
  content: string;
  user: string;
  avatarColor: string;
}

const mockReviews: ReviewItem[] = [
  {
    id: "rev-1",
    comicTitle: "The Greatest Estate Developer",
    rating: 5,
    content:
      "One of the best action/comedy manhwa I've ever read. The faces Lloyd makes are legendary and the infrastructure planning is genuinely engaging!",
    user: "LloydFanatic",
    avatarColor: "bg-pink-500",
  },
  {
    id: "rev-2",
    comicTitle: "Return of The Mad Demon",
    rating: 5,
    content:
      "Pure chaotic brilliance. The humor is unmatched, and the main character is delightfully insane. A breath of fresh air for the martial arts genre.",
    user: "JahaFanboy",
    avatarColor: "bg-purple-500",
  },
  {
    id: "rev-3",
    comicTitle: "Debut or Die",
    rating: 4,
    content:
      "Surprisingly intense! I didn't think an idol survival system layout would keep me on the edge of my seat like a high-stakes hunter raid, but it does.",
    user: "WebtoonSlayer",
    avatarColor: "bg-blue-500",
  },
];

export default function CommunityReviewSection() {
  return (
    <section className="w-full">
      {/* Section Header */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.4em] text-[#f6a1ff]/90">
          Reader Thoughts
        </p>
        <h2 className="mt-2 text-2xl font-black flex items-center gap-2">
          Community Reviews
        </h2>
      </div>

      {/* 3-Column Review Grid Track */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockReviews.map((review) => (
          <div
            key={review.id}
            className="flex flex-col justify-between rounded-2xl bg-white/5 border border-white/5 p-6 transition duration-300 hover:border-white/10 hover:bg-white/[0.07]"
          >
            <div>
              {/* Stars & Comic Reference */}
              <div className="flex items-center justify-between gap-2">
                <div className="text-amber-400 text-sm tracking-wider">
                  {"⭐".repeat(review.rating)}
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-white/40 line-clamp-1 max-w-[150px]">
                  {review.comicTitle}
                </span>
              </div>

              {/* Review Text Body */}
              <p className="mt-4 text-sm text-white/70 leading-relaxed italic">
                "{review.content}"
              </p>
            </div>

            {/* Reviewer User Row */}
            <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/5">
              <div
                className={`w-7 h-7 rounded-full ${review.avatarColor} flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-md`}
              >
                {review.user.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-xs font-bold tracking-wide text-pink-400">
                — {review.user}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
