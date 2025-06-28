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

  useEffect(() => {
    const fetchPromotions = async()=>{
      try {
        const data = await service.getAllPromotions();
        setPromotions(data);
      } catch (error) {
        console.error("Failed to get promotions", error);
      }
    };
    fetchPromotions();
  }, []);

  useEffect(() => {
    const fetchRomTypes = async() => { 
      try {
        const data = await service.getAllRoomTypes();
        setRoomTypes(data);
      } catch (error) {
        console.error("Failed to get promotions", error);
      }
    }
  }, []);

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
                'Discount type',
                'Discount',
                'Start date',
                'End date',
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
              <tr key={promo.promotionId} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium">{promo.name}</div>
                  <div className="text-gray-500 text-xs">{promo.description.substring(0,60)}...</div>
                </td>
                <td className="px-4 py-3 text-sm">{promo.type}</td>
                <td className="px-4 py-3 text-sm">{
                  promo.type === 'percentage' ? `${promo.discountValue}% off` : 
                    promo.type === 'fixed' ? `${promo.discountValue} off` : 'Added value'
                }</td>
                <td className="px-4 py-3 text-sm">{promo.startDate}</td>
                <td className="px-4 py-3 text-sm">{promo.endDate}</td>
                <td className="px-4 py-3 text-sm">{promo.minStay}</td>
                <td className="px-4 py-3 text-sm">{promo.roommApplicability}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      promo.isActive === true
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {promo.isActive === true ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm space-x-2">
                  <Link href={`/dashboard/promotions/${promo.promotionId}/edit`}>
                    <button className="text-blue-600 underline text-xs">Edit</button>
                  </Link>
                  <button ClassName="text-blue-600 underline text-xs" data-modal-target="edit-modal" data-modal-toggle="edit-modal">Details</button>
                  <button className="text-red-600 underline text-xs">
                    {promo.isActive === true ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <div>
      <div className="relative p-4 w-full max-w-2x1 max-h-full">
<!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Promotion name
                </h3>
            </div>
            <!-- Modal body -->
            <div class="p-4 md:p-5 space-y-4">
            <!-- Decsription-->
                <h4 className="mb-2 text-lg font-semibold text-gray-900">Description</h4>
                <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  Text
                </p>
            <!-- Room types-->
                <h4 className="mb-2 text-lg font-semibold text-gray-900">Applied room types</h4>
                <ul className="max-w-md space-y-1 text-gray-500 list-dics list-inside">
                  <il>Room type</il>
                </ul>
            </div>
            <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button data-modal-hide="default-modal" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Close
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}
