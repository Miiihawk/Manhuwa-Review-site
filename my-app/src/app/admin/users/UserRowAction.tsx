"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, Shield, Trash2 } from "lucide-react";

const roleOptions = ["ADMIN", "USER"];

export default function UserRowActions({
  user,
}: {
  user: { id: number; role: string; isActive: boolean };
}) {
  const router = useRouter();
  const [role, setRole] = useState(user.role);
  const [busy, setBusy] = useState(false);

  async function patch(body: Record<string, unknown>, failMsg: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || failMsg);
        return;
      }
      router.refresh();
    } catch (error) {
      console.error(failMsg, error);
      alert(`${failMsg} — check your connection.`);
    } finally {
      setBusy(false);
    }
  }

  async function handleSave() {
    if (role === user.role) return;
    await patch({ role }, "Could not update role.");
  }

  async function handleToggleActive() {
    await patch({ isActive: !user.isActive }, "Could not update status.");
  }

  async function handleDelete() {
    if (
      !window.confirm(
        "Delete this user? This permanently removes their account and content.",
      )
    )
      return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Could not delete user.");
        return;
      }
      router.refresh();
    } catch (error) {
      console.error("Delete user failed:", error);
      alert("Could not delete user — check your connection.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2 lg:justify-end">
      <div className="inline-flex h-11 items-center gap-2 rounded-full border border-[#f6a1ff]/25 bg-white/5 px-4 text-sm font-semibold text-white transition-colors hover:border-[#ff018f]/50 hover:bg-white/10">
        <Shield className="h-4 w-4" />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="bg-transparent text-sm font-semibold text-white outline-none"
        >
          {roleOptions.map((r) => (
            <option key={r} value={r} className="bg-[#120529] text-white">
              {r}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={handleToggleActive}
        disabled={busy}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-[#f6a1ff]/25 bg-white/5 px-4 text-sm font-semibold text-white transition-colors hover:border-[#ff018f]/50 hover:bg-white/10 disabled:opacity-60"
      >
        <Ban className="h-4 w-4" />
        {user.isActive ? "Deactivate" : "Reactivate"}
      </button>
      <button
        type="button"
        onClick={handleSave}
        disabled={busy}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-[#f6a1ff]/25 bg-white/5 px-4 text-sm font-semibold text-white transition-colors hover:border-[#ff018f]/50 hover:bg-white/10 disabled:opacity-60"
      >
        Save
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={busy}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 text-sm font-semibold text-white transition-colors hover:border-red-400/40 hover:bg-red-500/15 disabled:opacity-60"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>
    </div>
  );
}
