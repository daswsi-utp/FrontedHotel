'use client';

import React from 'react';
import {
  TrendingUp,
  DollarSign,
  BedDouble,
  Users,
  CalendarCheck,
  Coffee,
} from 'lucide-react';

/* ---------- Tarjeta reutilizable ---------- */
const StatsCard = ({
  label,
  value,
  change,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 hover:shadow-lg transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
        <p className="text-green-600 text-sm font-medium mt-2 flex items-center">
          <TrendingUp className="w-4 h-4 mr-1" />
          {change}
        </p>
      </div>
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

/* ---------- Página principal ---------- */
export default function HotelDashboardPage() {
  /* Stats principales */
  const stats = [
    {
      label: 'Ingresos Hoy',
      value: 'S/ 8 750',
      change: '+10 %',
      icon: DollarSign,
      color: 'bg-emerald-500',
    },
    {
      label: 'Ocupación',
      value: '78 %',
      change: '+4 %',
      icon: BedDouble,
      color: 'bg-indigo-500',
    },
    {
      label: 'Check-ins',
      value: '46',
      change: '+6 %',
      icon: CalendarCheck,
      color: 'bg-purple-500',
    },
    {
      label: 'Huéspedes en Casa',
      value: '132',
      change: '+8 %',
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  /* Actividad reciente (ejemplo) */
  const recentActivity = [
    {
      type: 'Reserva',
      description: 'Suite Doble – Juan Pérez',
      time: 'Hace 3 min',
      amount: 'S/ 420',
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      type: 'Check-out',
      description: 'Habitación 305 – Familia Díaz',
      time: 'Hace 12 min',
      amount: '3 noches',
      color: 'bg-rose-100 text-rose-600',
    },
    {
      type: 'Room Service',
      description: 'Desayuno – Hab 208',
      time: 'Hace 18 min',
      amount: 'S/ 65',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      type: 'Reserva',
      description: 'Habitación Simple – Luisa M.',
      time: 'Hace 25 min',
      amount: 'S/ 185',
      color: 'bg-indigo-100 text-indigo-600',
    },
  ];

  /* Servicios populares para gráfico de barras */
  const popularServices = [
    { service: 'Desayunos', uses: 92, percentage: 92 },
    { service: 'Spa', uses: 77, percentage: 77 },
    { service: 'Room Service', uses: 64, percentage: 64 },
    { service: 'Tours', uses: 38, percentage: 38 },
  ];

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Panel del Hotel</h1>
        <p className="text-slate-600">Vista general de la operación diaria</p>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <StatsCard key={i} {...s} />
        ))}
      </section>

      {/* Gráficos & Servicios Populares */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingresos del Mes */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Ingresos del Mes</h3>
            <select className="text-sm border border-slate-200 rounded-lg px-3 py-1 bg-white">
              <option>Últimos 30 días</option>
              <option>Últimos 7 días</option>
              <option>Hoy</option>
            </select>
          </div>
          <div className="h-64 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-700 mb-2">S/ 215 900</div>
              <p className="text-slate-500">Total del mes</p>
            </div>
          </div>
        </div>

        {/* Servicios Populares */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Servicios Populares</h3>
          <div className="space-y-4">
            {popularServices.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">{item.service}</span>
                  <span className="text-slate-500 text-sm">{item.uses} usos</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Actividad Reciente & Alertas */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actividad Reciente */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Actividad Reciente</h3>
            <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
              Ver todo
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((a, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.color}`}
                  >
                    <span className="text-sm font-semibold">{a.type[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{a.description}</p>
                    <p className="text-sm text-slate-500">{a.time}</p>
                  </div>
                </div>
                <span className="font-semibold text-slate-700">{a.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Alertas</h3>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-sm font-medium text-yellow-800">Mantenimiento</span>
              </div>
              <p className="text-sm text-yellow-700">Elevador principal fuera de servicio</p>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-sm font-medium text-red-800">Sobreventa</span>
              </div>
              <p className="text-sm text-red-700">
                Habitaciones Deluxe al 95 % de ocupación
              </p>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-sm font-medium text-emerald-800">Evento</span>
              </div>
              <p className="text-sm text-emerald-700">Conferencia “Tech 2025” mañana 9 AM</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
