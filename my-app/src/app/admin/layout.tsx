import type { ReactNode } from "react";
import AdminNavbar from "./components/layout/AdminNavbar";
import FooterAdmin from "../components/layout/FooterAdmin";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <AdminNavbar />
      <div className="flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
        <FooterAdmin />
      </div>
    </main>
  );
}
