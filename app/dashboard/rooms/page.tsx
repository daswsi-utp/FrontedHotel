'use client';

import api from "../../../gateway-services/ConnectionService";
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BedDouble,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Tags,
} from 'lucide-react';
import Link from 'next/link';
import CreateRoomModal from './CreateRoomModal';

interface RoomType {
  id: number;
  name: string;
  description: string;
  maxOccupancy: number;
  createdAt: string;
  updatedAt: string;
}

interface Image {
  id: number;
  imageUrl: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Room {
  roomId: number;              // antes era id
  roomNumber: number;
  roomType: RoomType;
  pricePerNight: number;       // antes price
  availabilityStatus: string;  // antes status
  capacity: number;
  roomSize: number;            // antes size
  description: string;
  images: Image[];
  tags: Tag[];
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    console.log('API URL =', process.env.NEXT_PUBLIC_API_URL);
    api
      .get<Room[]>(`/api/rooms/rooms`)
      .then((res) => {
        console.log('Payload de /rooms:', res.data);
        setRooms(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error al obtener habitaciones');
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BedDouble className="w-6 h-6" />
          Habitaciones
        </h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          Nueva Habitación
        </button>
      </div>

      {/* Create Modal */}
      <CreateRoomModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Filters */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <select className="border px-3 py-2 rounded-md text-sm">
          <option>Todos los tipos</option>
          <option>Suite</option>
          <option>Doble</option>
          <option>Sencilla</option>
        </select>
        <select className="border px-3 py-2 rounded-md text-sm">
          <option>Disponibilidad</option>
          <option>Disponible</option>
          <option>No disponible</option>
        </select>
      </div>

      {/* Loading / Error / Empty */}
      {loading ? (
        <p className="text-gray-600">Cargando habitaciones...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : rooms.length === 0 ? (
        <p className="text-gray-600">No hay habitaciones registradas.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={`room-${room.roomId}`}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={room.images[0]?.imageUrl || '/images/rooms/default.jpg'}
                alt={`Habitación ${room.roomNumber}`}
                className="w-full h-52 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-1">
                  Habitación {room.roomNumber} – {room.roomType.name}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  {room.availabilityStatus === 'AVAILABLE'
                    ? 'Disponible'
                    : 'No disponible'}
                </p>
                <p className="text-md text-gray-800 mb-1">
                  <strong>S/ {room.pricePerNight.toFixed(2)}</strong> por noche
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Capacidad: {room.capacity} | Tamaño: {room.roomSize} m²
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {room.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {room.tags.map((tag) => (
                    <span
                      key={`tag-${room.roomId}-${tag.id}`}
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1"
                    >
                      <Tags className="w-3 h-3" />
                      {tag.name}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex justify-between">
                  <button className="text-sm text-blue-600 flex items-center gap-1 hover:underline">
                    <Eye className="w-4 h-4" />
                    Ver
                  </button>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/rooms/${room.roomId}/edit`}
                      className="text-sm text-yellow-600 flex items-center gap-1 hover:underline"
                    >
                      <Pencil className="w-4 h-4" />
                      Editar
                    </Link>
                    <button className="text-sm text-red-600 flex items-center gap-1 hover:underline">
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
