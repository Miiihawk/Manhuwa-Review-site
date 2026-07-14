import Link from "next/link";
import { User, Mail, Shield, Calendar, ArrowLeft, Edit2 } from "lucide-react";

export default function AdminProfilePage() {
	const admin = {
		username: "Admin User",
		email: "admin@example.com",
		role: "Administrator",
		joinedDate: "Joined Jan 2026",
		stats: [
			{ label: "Reviewed", count: 142 },
			{ label: "Moderated", count: 38 },
			{ label: "Alerts", count: 7 },
		],
	};

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
								Admin Profile
							</p>
							<h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
								Your admin profile.
							</h1>
						</div>

						<div className="grid gap-3 sm:grid-cols-2">
							<div className="rounded-2xl border border-[#ff018f]/25 bg-[#ff018f]/10 px-4 py-3">
								<p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#f6a1ff]">
									Role
								</p>
								<p className="mt-1 text-lg font-black text-white">{admin.role}</p>
							</div>
							<div className="rounded-2xl border border-[#d9ccff]/20 bg-[#11012e]/80 px-4 py-3">
								<p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#d9ccff]">
									Joined
								</p>
								<p className="mt-1 text-lg font-black text-white">{admin.joinedDate}</p>
							</div>
						</div>
					</div>

					<section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
						{admin.stats.map(({ label, count }) => (
							<article
								key={label}
								className="group rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(17,1,46,0.92)_0%,rgba(0,0,0,0.84)_100%)] p-5 transition-transform duration-200 hover:-translate-y-1"
							>
								<div className="flex items-start justify-between gap-4">
									<div>
										<p className="text-sm font-medium text-white/64">{label}</p>
										<p className="mt-3 text-4xl font-black tracking-tight text-white">{count}</p>
									</div>
									<div className="rounded-2xl border border-[#ff018f]/20 bg-[#ff018f]/10 p-3 text-[#f6a1ff] shadow-[0_0_30px_rgba(255,1,143,0.08)]">
										<Shield className="h-5 w-5" />
									</div>
								</div>
								<p className="mt-4 text-sm font-medium text-[#d9ccff]">Admin profile activity</p>
								<div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
									<div className="h-full w-2/3 rounded-full bg-[linear-gradient(90deg,#ff018f_0%,#f6a1ff_50%,#d9ccff_100%)] transition-all duration-300 group-hover:w-[78%]" />
								</div>
							</article>
						))}
					</section>

					<section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#11012e]/70">
						<div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f6a1ff]">
									Account Details
								</p>
								<h2 className="mt-2 text-2xl font-black text-white">Admin account info</h2>
							</div>
							<button className="inline-flex h-11 items-center gap-2 rounded-full border border-[#f6a1ff]/25 bg-white/5 px-4 text-sm font-semibold text-white transition-colors hover:border-[#ff018f]/50 hover:bg-white/10">
								<Edit2 className="h-4 w-4" />
								Edit preferences
							</button>
						</div>

						<div className="divide-y divide-white/10">
							<div className="flex items-center justify-between px-5 py-5 sm:px-6">
								<div className="flex items-center gap-3">
									<User className="h-[1.15rem] w-[1.15rem] text-white/40" />
									<div>
										<p className="text-[10px] font-bold uppercase tracking-wider text-white/35">Display Name</p>
										<p className="mt-1 text-sm font-semibold text-white/90">{admin.username}</p>
									</div>
								</div>
								<span className="rounded-full border border-[#d9ccff]/20 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[#d9ccff]">
									Admin
								</span>
							</div>

							<div className="flex items-center justify-between px-5 py-5 sm:px-6">
								<div className="flex items-center gap-3">
									<Mail className="h-[1.15rem] w-[1.15rem] text-white/40" />
									<div>
										<p className="text-[10px] font-bold uppercase tracking-wider text-white/35">Email Address</p>
										<p className="mt-1 text-sm font-semibold text-white/90">{admin.email}</p>
									</div>
								</div>
								<span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white/55">
									Verified
								</span>
							</div>
						</div>
					</section>
				</section>
			</div>
		</main>
	);
}
