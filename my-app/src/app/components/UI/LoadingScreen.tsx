export default function LoadingScreen() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white">
      {/* Ambient glow — matches the app's dark/pink theme */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,1,143,0.12),transparent_35%),radial-gradient(circle_at_70%_20%,rgba(45,12,98,0.2),transparent_35%)]" />

      <div className="relative flex flex-col items-center gap-6">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/10" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#ff018f] border-r-[#f6a1ff]" />
        </div>
        <p className="animate-pulse text-xs font-bold uppercase tracking-[0.5em] text-[#f6a1ff]/80">
          Seqily
        </p>
      </div>
    </main>
  );
}
