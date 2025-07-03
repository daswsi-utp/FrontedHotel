'use client';

import { useEffect, useState } from 'react';
import { BedDouble, Tags } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from "../gateway-services/ConnectionService";

interface RoomType {
  id: number;
  name: string;
}

interface Image {
  id: number;
  filename: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Room {
  roomId: number;
  roomNumber: number;
  roomType: RoomType;
  pricePerNight: number;
  availabilityStatus: string;
  capacity: number;
  roomSize: number;
  description: string;
  images: Image[];
  tags: Tag[];
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const router = useRouter(); // ✅ añadido

  useEffect(() => {
    api
      .get<Room[]>(`/api/rooms/rooms`)
      .then((res) => {
        setRooms(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error al obtener habitaciones');
        console.error(err);
        setLoading(false);
      });

    api
      .get<RoomType[]>(`/api/rooms/roomtype`)
      .then((res) => setRoomTypes(res.data))
      .catch((err) => {
        console.error('Error al obtener tipos de habitación:', err);
        setRoomTypes([]);
      });
  }, []);

  const filteredRooms = selectedType
    ? rooms.filter((room) => room.roomType.name === selectedType)
    : rooms;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BedDouble className="w-6 h-6" />
          Habitaciones
        </h1>
      </div>

      <div className="mb-6 flex gap-4 flex-wrap">
        <select
          className="border px-3 py-2 rounded-md text-sm"
          onChange={(e) => setSelectedType(e.target.value)}
          value={selectedType}
        >
          <option value="">Todos los tipos</option>
          {roomTypes.map((type) => (
            <option key={type.id} value={type.name}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando habitaciones...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : filteredRooms.length === 0 ? (
        <p className="text-gray-600">No hay habitaciones registradas.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div
              key={`room-${room.roomId}`}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={
                  room.images[0]
                    ? `${process.env.NEXT_PUBLIC_API_URL}/rooms/images/${room.images[0].filename}`
                    : '/images/rooms/default.jpg'
                }
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
                <p className="text-sm text-gray-600 mb-4">{room.description}</p>

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

                <div className="mt-4">
                  <button
                    onClick={() => router.push(`/rooms/${room.roomId}`)} // ✅ redirección
                    className="w-full text-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Reservar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
