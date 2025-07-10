"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Tag,
  Mail,
  User,
  LogOut,
} from "lucide-react";
import "../globals.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    // Limpieza de token…
    localStorage.removeItem("access_token");
    document.cookie = [
      "access_token=;",
      "Path=/;",
      `Expires=${new Date(0).toUTCString()};`,
      "SameSite=Strict;",
    ].join(" ");
    router.push("/auth/login");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar fijo */}
      <aside className="w-64 bg-slate-800 text-white p-6 flex flex-col justify-between h-full">
        <div>
          <h2 className="text-2xl font-bold mb-8">Hotel Admin MUNAY WASI</h2>
          <nav className="flex flex-col space-y-4">
            <NavLink href="/dashboard" icon={<LayoutDashboard size={20} />}>
              Estadísticas
            </NavLink>
            <NavLink href="/dashboard/users" icon={<User size={20} />}>
              Users
            </NavLink>
            <NavLink href="/dashboard/rooms" icon={<BedDouble size={20} />}>
              Rooms
            </NavLink>
            <NavLink
              href="/dashboard/reservations"
              icon={<CalendarCheck size={20} />}
            >
              Reservations
            </NavLink>
            <NavLink href="/dashboard/promotions" icon={<Tag size={20} />}>
              Promotions
            </NavLink>
            <NavLink href="/dashboard/message" icon={<Mail size={20} />}>
              Messages
            </NavLink>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-600 transition text-red-100 hover:text-white"
        >
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </aside>
      {/* Contenido scrollable */}
      <main className="flex-1 bg-gray-50 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-600 transition"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
