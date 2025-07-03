'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from "../../gateway-services/ConnectionService";
interface Room {
  roomId: number;
  roomNumber: number;
  roomType: { name: string };
  pricePerNight: number;
  availabilityStatus: string;
  capacity: number;
  roomSize: number;
  description: string;
  images: { id: number; filename: string }[];
  tags: { id: number; name: string }[];
}

export default function RoomDetailPage() {
  const { id } = useParams();
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/api/rooms/rooms/${id}`)
      .then((res) => setRoom(res.data))
      .catch((err) => console.error('Error al cargar habitación', err));
  }, [id]);

  if (!room) return <p className="p-6">Cargando habitación...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Galería + Detalles */}
      <div className="lg:col-span-2 space-y-6">
        {/* Galería */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-lg overflow-hidden">
          {room.images.map((img) => (
            <img
              key={img.id}
              src={`${process.env.NEXT_PUBLIC_API_URL}/rooms/images/${img.filename}`}
              alt="Room"
              className="w-full h-48 object-cover rounded-md"
            />
          ))}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">
            Habitación {room.roomNumber} – {room.roomType.name}
          </h1>
          <p className="text-gray-700 mb-3">{room.description}</p>

          <div className="flex gap-6 text-sm text-gray-600 mb-3">
            <span>👥 {room.capacity} personas</span>
            <span>📐 {room.roomSize} m²</span>
            <span>
              {room.availabilityStatus === 'AVAILABLE'
                ? '✅ Disponible'
                : '❌ No disponible'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {room.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tarjeta lateral de reserva */}
      <div className="sticky top-6 border rounded-2xl shadow-lg p-6 bg-white space-y-5">
        <div className="text-2xl font-semibold text-gray-900">
          S/ {room.pricePerNight.toFixed(2)}{' '}
          <span className="text-sm text-gray-500 font-normal">por noche</span>
        </div>

        {/* Inputs de fecha y huéspedes */}
        <div className="border rounded-xl overflow-hidden">
          <div className="grid grid-cols-2 divide-x">
            <div className="p-3">
              <label className="block text-xs font-semibold text-gray-500">
                Llegada
              </label>
              <input
                type="date"
                className="w-full text-sm mt-1 bg-transparent focus:outline-none"
              />
            </div>
            <div className="p-3">
              <label className="block text-xs font-semibold text-gray-500">
                Salida
              </label>
              <input
                type="date"
                className="w-full text-sm mt-1 bg-transparent focus:outline-none"
              />
            </div>
          </div>
          <div className="p-3 border-t">
            <label className="block text-xs font-semibold text-gray-500">
              Huéspedes
            </label>
            <select className="w-full mt-1 text-sm rounded-md border px-2 py-1">
              {[...Array(room.capacity)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} huésped{i > 0 ? 'es' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="w-full bg-pink-600 hover:bg-pink-700 text-white text-md font-semibold py-3 rounded-xl transition">
          Reservar
        </button>
      </div>
    </div>
  );
}
