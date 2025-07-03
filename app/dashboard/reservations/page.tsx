'use client';

import { useEffect, useState } from 'react';
import { Eye, Pencil } from 'lucide-react';
import Link from 'next/link';
import api from "../../gateway-services/ConnectionService";

interface Reservation {
  id: number;
  guestName: string;
  guestEmail: string;
  roomNumber: number;
  checkIn: string;
  checkOut: string;
  total: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<'All' | 'CONFIRMED' | 'PENDING' | 'CANCELLED'>('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchReservations() {
      try {
        const { data } = await api.get<Reservation[]>(`/api/bookings/detail`);
        setReservations(data);
      } catch (error) {
        console.error('Failed to fetch:', error);
      }
    }
    fetchReservations();
  }, []);

  const filtered = reservations
    .filter(r => filter === 'All' || r.status === filter)
    .filter(r =>
      `${r.guestName} ${r.guestEmail} ${r.roomNumber}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="p-6 space-y-6">
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

      <div className="flex gap-2">
        {(['All', 'CONFIRMED', 'PENDING', 'CANCELLED'] as const).map(option => (
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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              {['ID', 'Guest', 'Room', 'Check-in', 'Check-out', 'Total', 'Status', 'Actions'].map(col => (
                <th key={col} className="px-4 py-2 text-sm font-medium text-gray-600">{col}</th>
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
                <td className="px-4 py-3 text-sm">{res.roomNumber}</td>
                <td className="px-4 py-3 text-sm">{formatDate(res.checkIn)}</td>
                <td className="px-4 py-3 text-sm">{formatDate(res.checkOut)}</td>
                <td className="px-4 py-3 text-sm">${res.total}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      res.status === 'CONFIRMED'
                        ? 'bg-green-100 text-green-800'
                        : res.status === 'PENDING'
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
                  <Link href={`/dashboard/reservations/${res.id}/save`}>
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
