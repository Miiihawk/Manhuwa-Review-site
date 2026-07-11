import Link from "next/link";

type BrandLogoProps = {
  compact?: boolean;
  href?: string;
  className?: string;
};

export default function BrandLogo({
  compact = false,
  href = "/",
  className = "",
}: BrandLogoProps) {
  const content = (
    <>
      <span className="relative flex h-10 w-12 items-center justify-center bg-transparent">
        <svg
          viewBox="0 0 72 24"
          aria-hidden="true"
          className="relative h-6 w-12 drop-shadow-[0_0_10px_rgba(255,255,255,0.22)]"
        >
          <path
            d="M10 7.2h18c2.6 0 4.8 2.1 4.8 4.8s-2.1 4.8-4.8 4.8H10c-2.6 0-4.8-2.1-4.8-4.8S7.4 7.2 10 7.2Z"
            fill="none"
            stroke="url(#brand-logo-chain)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="rotate(-18 19 12)"
          />
          <path
            d="M34 7.2h18c2.6 0 4.8 2.1 4.8 4.8s-2.1 4.8-4.8 4.8H34c-2.6 0-4.8-2.1-4.8-4.8S31.4 7.2 34 7.2Z"
            fill="none"
            stroke="url(#brand-logo-chain)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="rotate(18 43 12)"
          />
          <path
            d="M24 12c2.5-2 5.2-2.9 8-2.9s5.5.9 8 2.9"
            stroke="url(#brand-logo-chain)"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.96"
          />
          <defs>
            <linearGradient id="brand-logo-chain" x1="0" y1="0" x2="72" y2="24">
              <stop offset="0%" stopColor="#fff7e0" />
              <stop offset="40%" stopColor="#f6a1ff" />
              <stop offset="72%" stopColor="#ff018f" />
              <stop offset="100%" stopColor="#d9ccff" />
            </linearGradient>
          </defs>
        </svg>
      </span>

      {!compact ? (
        <span className="flex flex-col leading-none">
          <span className="bg-[linear-gradient(90deg,#fff6cf_0%,#ffd6f3_28%,#f6a1ff_60%,#d9ccff_100%)] bg-clip-text text-3xl font-black tracking-[-0.08em] text-transparent drop-shadow-[0_2px_18px_rgba(255,255,255,0.08)]">
            SEQILY
          </span>
          <span className="mt-1 text-[0.70rem] font-medium uppercase tracking-[0.20em] text-white/55">
            Rate & Archive
          </span>
        </span>
      ) : (
        <span className="flex flex-col leading-none">
          <span className="bg-[linear-gradient(90deg,#fff6cf_0%,#ffd6f3_35%,#f6a1ff_70%,#d9ccff_100%)] bg-clip-text text-2xl font-black tracking-[-0.08em] text-transparent drop-shadow-[0_2px_14px_rgba(255,255,255,0.08)]">
            SEQILY
          </span>
        </span>
      )}
    </>
  );

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-3 ${className}`}
      aria-label="Seqily home"
    >
      {content}
    </Link>
  );
}
