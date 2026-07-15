"use client";

import { useState } from "react";
import { Star, MessageSquare, X } from "lucide-react";

interface ReviewFormModalProps {
  comicTitle: string;
  onClose: () => void;
  onSubmit: (data: { text: string; rating: number }) => void;
  initialText?: string;
  initialRating?: number;
}

export default function ReviewFormModal({
  comicTitle,
  onClose,
  onSubmit,
  initialText = "",
  initialRating = 5,
}: ReviewFormModalProps) {
  const [reviewText, setReviewText] = useState(initialText);
  const [rating, setRating] = useState(initialRating);

  const displayScore = rating * 2;

  const handleSubmitForm = () => {
    if (!reviewText.trim()) return;
    onSubmit({ text: reviewText, rating });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop Glass Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Canvas Window Box */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0d071f] p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center justify-center gap-2 text-white/90 font-bold text-base mb-1 mt-2">
          <MessageSquare className="h-4 w-4 text-[#ff018f]" /> Write a review
        </div>
        <p className="text-xs text-white/50 mb-6">Enjoying {comicTitle}?</p>

        {/* Writing Canvas Box Area */}
        <div className="w-full border border-white/10 rounded-xl bg-black/40 overflow-hidden text-left p-4">
          <div className="flex gap-4 text-xs text-white/30 border-b border-white/5 pb-2.5 mb-3 font-mono">
            <span className="font-black text-white/60 hover:text-white cursor-pointer">
              B
            </span>
            <span className="italic text-white/60 hover:text-white cursor-pointer">
              I
            </span>
            <span className="line-through text-white/60 hover:text-white cursor-pointer">
              S
            </span>
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your full thoughts and review here..."
            className="w-full bg-transparent border-none text-sm text-white/80 placeholder-white/20 focus:outline-none resize-none h-36 leading-relaxed"
          />
        </div>

        {/* Rating Dial Matrix */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="text-xs font-bold tracking-wide text-white/80">
            Your Final Rating:
          </div>
          <div className="h-10 w-10 rounded-full bg-[#ff018f] text-white flex items-center justify-center font-black text-sm shadow-[0_0_15px_rgba(255,1,143,0.5)]">
            {displayScore}
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 mt-1">
            {[...Array(5)].map((_, i) => {
              const starValue = i + 1;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(starValue)}
                  className="hover:scale-110 active:scale-95 transition focus:outline-none"
                >
                  <Star
                    className={`h-4 w-4 ${
                      starValue <= rating
                        ? "fill-current text-amber-400"
                        : "text-white/20"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls Footer */}
        <div className="w-full flex items-center justify-between border-t border-white/5 mt-6 pt-4">
          <div className="text-[10px] text-white/30 text-left leading-tight">
            Please ensure reviews remain respectful <br /> and adhere to
            community guidelines.
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="h-9 px-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-xs font-bold text-white/70 transition"
            >
              Cancel
            </button>
            <button
              disabled={!reviewText.trim()}
              onClick={handleSubmitForm}
              className={`h-9 px-5 border rounded-lg text-xs font-black transition-all duration-150 ${
                reviewText.trim()
                  ? "bg-[#ff018f] text-white border-[#ff018f] hover:bg-[#ff018f]/90 active:scale-95 shadow-md"
                  : "bg-white/5 border-white/5 text-white/30 cursor-not-allowed"
              }`}
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
