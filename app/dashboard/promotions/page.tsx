'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as service from '../promotions/service/promotionService.ts'

export default function PromotionsPage() {
  // 👇 Datos de ejemplo; luego reemplaza con tu llamada a la API
  const [promotions, setPromotions] = useState<service.Promotion[]>([]);
  const [roomType, setRoomTypes] = usestate<service.RoomType[]>([]);
  const [promotionRequest, setPromotionRequest] = useState<service.PromotionRequest>();
  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [search, setSearch] = useState('');

  const filtered = promotions
    .filter(p => filter === 'All' || p.status === filter)
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-6">
      {/* Título y botón */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Promotions & Discounts</h1>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          Add New Promotion
        </button>
      </div>

      {/* Search y filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder="Search promotions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/3"
        />

        <div className="space-x-2">
          {(['All', 'Active', 'Inactive'] as const).map(option => (
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
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              {[
                'Title',
                'Discount',
                'Period',
                'Minimum Stay',
                'Applicable Rooms',
                'Status',
                'Actions',
              ].map(col => (
                <th key={col} className="px-4 py-2 text-sm font-medium text-gray-600">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(promo => (
              <tr key={promo.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium">{promo.title}</div>
                  <div className="text-gray-500 text-xs">{promo.description}</div>
                </td>
                <td className="px-4 py-3 text-sm">{promo.discountText}</td>
                <td className="px-4 py-3 text-sm">{promo.period}</td>
                <td className="px-4 py-3 text-sm">{promo.minStay}</td>
                <td className="px-4 py-3 text-sm">{promo.applicableRooms}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      promo.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {promo.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm space-x-2">
                  <Link href={`/dashboard/promotions/${promo.id}/edit`}>
                    <button className="text-blue-600 underline text-xs">Edit</button>
                  </Link>
                  <button className="text-red-600 underline text-xs">
                    {promo.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
