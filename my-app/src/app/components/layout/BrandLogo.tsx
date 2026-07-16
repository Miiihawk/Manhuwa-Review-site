import Link from "next/link";
import Image from "next/image";

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
      <span className="relative flex h-10 w-10 items-center justify-center">
        <Image
          src="/logo.png"
          alt="Seqily"
          width={40}
          height={40}
          priority
          className="h-9 w-9 object-contain drop-shadow-[0_0_12px_rgba(246,161,255,0.35)]"
        />
      </span>

      {!compact ? (
        <span className="flex flex-col leading-none">
          <span className="bg-[linear-gradient(90deg,#fff6cf_0%,#ffd6f3_28%,#f6a1ff_60%,#d9ccff_100%)] bg-clip-text text-3xl font-black tracking-[-0.08em] text-transparent drop-shadow-[0_2px_18px_rgba(255,255,255,0.08)]">
            SEQILY
          </span>
          <span className="mt-1 text-[0.70rem] font-medium uppercase tracking-[0.20em] text-white/55">
            Archive your faves
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
