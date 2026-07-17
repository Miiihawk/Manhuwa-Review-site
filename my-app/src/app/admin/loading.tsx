export default function AdminLoading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/10" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#ff018f] border-r-[#f6a1ff]" />
        </div>
        <p className="animate-pulse text-xs font-bold uppercase tracking-[0.5em] text-[#f6a1ff]/80">
          Seqily
        </p>
      </div>
    </div>
  );
}
