"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  FileText,
  Lock,
  Save,
  X,
  Edit2,
  Upload,
  Camera,
} from "lucide-react";

type Props = {
  userId: number;
  initialUsername: string;
  initialBio: string;
  initialProfilePic: string;
};

export default function EditProfileForm({
  userId,
  initialUsername,
  initialBio,
  initialProfilePic,
}: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(initialUsername);
  const [bio, setBio] = useState(initialBio);
  const [profilePic, setProfilePic] = useState(initialProfilePic);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function cancel() {
    setUsername(initialUsername);
    setBio(initialBio);
    setProfilePic(initialProfilePic);
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setEditing(false);
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Could not upload image.");
        return;
      }
      setProfilePic(data.url);
    } catch (err) {
      console.error("Avatar upload failed:", err);
      setError("Could not upload image — check your connection.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword && newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          bio,
          ...(profilePic !== initialProfilePic ? { profilePic } : {}),
          ...(newPassword ? { newPassword, confirmPassword } : {}),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.error) {
          setError(data.error);
        } else if (data?.errors) {
          const first = Object.values(data.errors)[0];
          setError(
            Array.isArray(first) ? first[0] : "Please check your input.",
          );
        } else {
          setError("Could not update profile.");
        }
        return;
      }

      setSuccess("Profile updated.");
      setNewPassword("");
      setConfirmPassword("");
      setEditing(false);
      router.refresh();
    } catch (err) {
      console.error("Update profile failed:", err);
      setError("Could not update profile — check your connection.");
    } finally {
      setLoading(false);
    }
  }

  if (!editing) {
    return (
      <div className="mt-6">
        {success && (
          <p className="mb-3 text-xs font-semibold text-green-400">{success}</p>
        )}
        <button
          onClick={() => setEditing(true)}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-white/10 border border-white/5 px-5 text-xs font-bold tracking-wide text-white transition hover:bg-white/15 active:scale-95"
        >
          <Edit2 className="h-3.5 w-3.5" /> Edit Profile
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-widest text-[#f6a1ff]">
        Edit Profile
      </h3>

      {error && (
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400">
          {error}
        </p>
      )}

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white/5 border border-white/10">
          {profilePic ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profilePic}
              alt="Avatar preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <Camera className="h-5 w-5 text-white/40" />
          )}
        </div>
        <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full bg-white/10 border border-white/5 px-4 text-xs font-bold text-white transition hover:bg-white/15">
          <Upload className="h-3.5 w-3.5" />{" "}
          {uploading ? "Uploading…" : "Change Photo"}
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Username */}
      <label className="block">
        <span className="text-[10px] uppercase font-bold tracking-wider text-white/35 flex items-center gap-1.5">
          <User className="h-3 w-3" /> Display Name
        </span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          minLength={3}
          maxLength={32}
          required
          className="mt-1.5 w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white/90 outline-none focus:border-[#ff018f]/50"
        />
      </label>

      {/* Bio */}
      <label className="block">
        <span className="text-[10px] uppercase font-bold tracking-wider text-white/35 flex items-center gap-1.5">
          <FileText className="h-3 w-3" /> Bio
        </span>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={500}
          rows={3}
          className="mt-1.5 w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white/90 outline-none focus:border-[#ff018f]/50 resize-none"
        />
      </label>

      {/* New password */}
      <label className="block">
        <span className="text-[10px] uppercase font-bold tracking-wider text-white/35 flex items-center gap-1.5">
          <Lock className="h-3 w-3" /> New Password
        </span>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password (leave blank to keep current)"
          className="mt-1.5 w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white/90 outline-none focus:border-[#ff018f]/50"
        />
      </label>

      {/* Confirm password */}
      <label className="block">
        <span className="text-[10px] uppercase font-bold tracking-wider text-white/35 flex items-center gap-1.5">
          <Lock className="h-3 w-3" /> Confirm New Password
        </span>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter new password"
          className="mt-1.5 w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white/90 outline-none focus:border-[#ff018f]/50"
        />
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || uploading}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-tr from-[#ff018f] to-[#f6a1ff] px-5 text-xs font-bold tracking-wide text-white transition hover:opacity-90 active:scale-95 disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" />{" "}
          {loading ? "Saving…" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={cancel}
          disabled={loading}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-white/10 border border-white/5 px-5 text-xs font-bold tracking-wide text-white transition hover:bg-white/15 active:scale-95 disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" /> Cancel
        </button>
      </div>
    </form>
  );
}
