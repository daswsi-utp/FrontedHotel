'use client';

import { useState } from 'react';
import { Eye, Pencil } from 'lucide-react';
import Link from 'next/link';

interface Reservation {
  id: number;
  guestName: string;
  guestEmail: string;
  roomName: string;
  checkIn: string;   // ISO o formato legible
  checkOut: string;
  total: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export default function ReservationsPage() {
  const [reservations] = useState<Reservation[]>([
    {
      id: 4,
      guestName: 'Jennifer Adams',
      guestEmail: 'j.adams@example.com',
      roomName: 'Family Suite',
      checkIn: 'Mar 24, 2025',
      checkOut: 'Mar 31, 2025',
      total: 3850,
      status: 'Confirmed',
    },
    {
      id: 3,
      guestName: 'Michael Brown',
      guestEmail: 'm.brown@example.com',
      roomName: 'Royal Suite',
      checkIn: 'Mar 31, 2025',
      checkOut: 'Apr 04, 2025',
      total: 3400,
      status: 'Pending',
    },
    {
      id: 5,
      guestName: 'David Wilson',
      guestEmail: 'd.wilson@example.com',
      roomName: 'Executive Room',
      checkIn: 'Mar 17, 2025',
      checkOut: 'Mar 20, 2025',
      total: 1200,
      status: 'Cancelled',
    },
    {
      id: 2,
      guestName: 'Sarah Johnson',
      guestEmail: 'sarah.j@example.com',
      roomName: 'Garden View Room',
      checkIn: 'Mar 09, 2025',
      checkOut: 'Mar 11, 2025',
      total: 440,
      status: 'Confirmed',
    },
    {
      id: 1,
      guestName: 'John Smith',
      guestEmail: 'john.smith@example.com',
      roomName: 'Deluxe Ocean View',
      checkIn: 'Mar 14, 2025',
      checkOut: 'Mar 19, 2025',
      total: 1750,
      status: 'Confirmed',
    },
  ]);

  const [filter, setFilter] = useState<'All' | 'Confirmed' | 'Pending' | 'Cancelled'>('All');
  const [search, setSearch] = useState('');

  const filtered = reservations
    .filter(r => filter === 'All' || r.status === filter)
    .filter(r =>
      `${r.guestName} ${r.guestEmail} ${r.roomName}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Reservations</h1>
        <input
          type="text"
          placeholder="Search by guest, email, or room..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-sm"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['All', 'Confirmed', 'Pending', 'Cancelled'] as const).map(option => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`px-3 py-1 rounded-full border ${
              filter === option
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              {['ID', 'Guest', 'Room', 'Check-in', 'Check-out', 'Total', 'Status', 'Actions'].map(col => (
                <th key={col} className="px-4 py-2 text-sm font-medium text-gray-600">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(res => (
              <tr key={res.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">#{res.id}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium">{res.guestName}</div>
                  <div className="text-gray-500 text-xs">{res.guestEmail}</div>
                </td>
                <td className="px-4 py-3 text-sm">{res.roomName}</td>
                <td className="px-4 py-3 text-sm">{res.checkIn}</td>
                <td className="px-4 py-3 text-sm">{res.checkOut}</td>
                <td className="px-4 py-3 text-sm">${res.total}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      res.status === 'Confirmed'
                        ? 'bg-green-100 text-green-800'
                        : res.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {res.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm space-x-2">
                  <button className="text-blue-600 underline text-xs flex items-center gap-1">
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <Link href={`/dashboard/reservations/${res.id}/edit`}>
                    <button className="text-green-600 underline text-xs flex items-center gap-1">
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                  No reservations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
