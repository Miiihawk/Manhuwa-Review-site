import Link from "next/link";
import { ArrowLeft, Ban, Shield, Trash2 } from "lucide-react";
import { userService } from "@/app/lib/services/user.service";

// SSR: re-render on every request so the admin always sees live data.
export const dynamic = "force-dynamic";

const roleOptions = ["ADMIN", "USER"];

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const users = await userService.listUsers();
  const resolvedSearchParams = (await searchParams) ?? {};
  const query = resolvedSearchParams.q?.trim().toLowerCase() ?? "";
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query),
  );

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const memberCount = users.filter((u) => u.role === "USER").length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,1,143,0.16),transparent_24%),radial-gradient(circle_at_75%_20%,rgba(45,12,98,0.35),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(246,161,255,0.12),transparent_26%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.96)_0%,rgba(17,1,46,0.94)_45%,rgba(0,0,0,0.98)_100%)]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-28 sm:px-10 lg:px-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/65 transition-colors hover:text-[#f6a1ff]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>

        <section>
          <div className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#f6a1ff]">
                User Management
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Manage users in one place.
              </h1>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-[#ff018f]/25 bg-[#ff018f]/10 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#f6a1ff]">
                Total Users
              </p>
              <p className="mt-1 text-lg font-black text-white">{users.length}</p>
            </div>
            <div className="rounded-2xl border border-[#d9ccff]/20 bg-[#11012e]/80 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#d9ccff]">
                Admins
              </p>
              <p className="mt-1 text-lg font-black text-white">{adminCount}</p>
            </div>
            <div className="rounded-2xl border border-[#d9ccff]/20 bg-[#11012e]/80 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#d9ccff]">
                Members
              </p>
              <p className="mt-1 text-lg font-black text-white">
                {memberCount}
              </p>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#11012e]/70">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
              <div>
                <h2 className="mt-2 text-2xl font-black text-white">
                  Current user list
                </h2>
              </div>
              <form action="" className="w-full max-w-sm">
                <input
                  type="search"
                  name="q"
                  defaultValue={resolvedSearchParams.q ?? ""}
                  placeholder="Search username or gmail"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
                />
              </form>
            </div>

            <div className="divide-y divide-white/10">
              {filteredUsers.map((user) => (
                <article
                  key={user.id}
                  className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-[#ff018f]/20 bg-[#ff018f]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[#f6a1ff]">
                        {user.role}
                      </span>
                      <span className="text-xs font-medium text-white/45">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-white">
                        {user.username}
                      </h3>
                      <p className="mt-1 text-sm text-white/66">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <div className="inline-flex h-11 items-center gap-2 rounded-full border border-[#f6a1ff]/25 bg-white/5 px-4 text-sm font-semibold text-white transition-colors hover:border-[#ff018f]/50 hover:bg-white/10">
                      <Shield className="h-4 w-4"/>
                      <select
                        defaultValue={user.role}
                        className="bg-transparent text-sm font-semibold text-white outline-none">
                        {roleOptions.map((role) => (
                          <option
                            key={role}
                            value={role}
                            className="bg-[#120529] text-white"
                          >
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-[#f6a1ff]/25 bg-white/5 px-4 text-sm font-semibold text-white transition-colors hover:border-[#ff018f]/50 hover:bg-white/10"
                    >
                      <Ban className="h-4 w-4" />
                      Deactivate
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-[#f6a1ff]/25 bg-white/5 px-4 text-sm font-semibold text-white transition-colors hover:border-[#ff018f]/50 hover:bg-white/10"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 text-sm font-semibold text-white transition-colors hover:border-red-400/40 hover:bg-red-500/15"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
