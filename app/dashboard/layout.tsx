// app/dashboard/layout.tsx

import Link from "next/link";
import { LayoutDashboard, BedDouble, CalendarCheck, Tag, Mail ,User} from "lucide-react";
import "../globals.css"; // Asegúrate de importar estilos globales si los tienes

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white p-6 space-y-6">
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
          <NavLink href="/dashboard/reservations" icon={<CalendarCheck size={20} />}>
            Reservations
          </NavLink>
          <NavLink href="/dashboard/promotions" icon={<Tag size={20} />}>
            Promotions
          </NavLink>
          <NavLink href="/dashboard/message" icon={<Mail size={20} />}>
            Messages
          </NavLink>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
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
