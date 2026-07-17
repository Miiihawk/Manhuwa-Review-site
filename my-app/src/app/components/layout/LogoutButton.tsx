"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push("/login?loggedOut=true");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      title="Logout"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/60 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 active:scale-95"
    >
      <LogOut className="h-[1.15rem] w-[1.15rem]" />
    </button>
  );
}
