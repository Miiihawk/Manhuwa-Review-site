import type { ReactNode } from "react";
import AdminNavbar from "./components/layout/AdminNavbar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <AdminNavbar />
      {children}
    </main>
  );
}
