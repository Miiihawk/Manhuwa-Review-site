import Link from "next/link";
import { ArrowLeft, Settings2, Shield, LogOut } from "lucide-react";

export default function SettingsPage() {
	return (
		<main className="relative min-h-screen overflow-hidden bg-black text-white">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,1,143,0.12),transparent_30%),radial-gradient(circle_at_70%_20%,rgba(45,12,98,0.2),transparent_30%)]" />
			<div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.98)_0%,rgba(11,2,26,0.95)_50%,rgba(0,0,0,1)_100%)]" />

			<div className="relative mx-auto max-w-4xl px-6 pt-28 pb-16 sm:px-10 lg:px-12 z-10">
				<Link
					href="/dashboard"
					className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-[#f6a1ff] mb-8 group"
				>
					<ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
					Back to Dashboard
				</Link>

				<section className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
					<div className="flex items-center gap-2.5">
						<Settings2 className="h-5 w-5 text-[#f6a1ff]" />
						<p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#f6a1ff]/90">
							Account
						</p>
					</div>
					<h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
						Settings
					</h1>
					<p className="mt-2 max-w-2xl text-xs sm:text-sm text-white/65 leading-relaxed">
						Manage account preferences and access controls from this page.
					</p>

					<div className="mt-8 grid gap-4 sm:grid-cols-2">
						<div className="rounded-3xl border border-white/10 bg-black/30 p-5">
							<div className="flex items-center gap-2 text-white/80">
								<Shield className="h-4 w-4 text-[#f6a1ff]" />
								<h2 className="font-bold">Security</h2>
							</div>
							<p className="mt-2 text-sm text-white/55">
								Password and session controls can live here.
							</p>
						</div>

						<div className="rounded-3xl border border-white/10 bg-black/30 p-5">
							<div className="flex items-center gap-2 text-white/80">
								<LogOut className="h-4 w-4 text-[#f6a1ff]" />
								<h2 className="font-bold">Sign out</h2>
							</div>
							<p className="mt-2 text-sm text-white/55">
								Use the logout screen to end your current session.
							</p>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}
