"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;

  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "",
    pricePerNight: "",
    capacity: "",
    roomSize: "",
    description: "",
  });

  useEffect(() => {
    // Simula la carga de datos del backend
    const fetchRoom = async () => {
      // Aquí reemplaza por tu lógica real
      const data = {
        roomNumber: "101",
        roomType: "Suite",
        pricePerNight: "180",
        capacity: "4",
        roomSize: "45.5",
        description: "Suite con vista al mar y jacuzzi",
      };

      setFormData(data);
    };

    fetchRoom();
  }, [roomId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Aquí puedes hacer un PUT a tu backend
    console.log("Datos actualizados:", formData);

    // Redirigir después de guardar
    router.push("/dashboard/rooms");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Editar Habitación #{roomId}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="roomNumber"
          placeholder="Número de habitación"
          value={formData.roomNumber}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          name="roomType"
          placeholder="Tipo de habitación"
          value={formData.roomType}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="number"
          name="pricePerNight"
          placeholder="Precio por noche"
          value={formData.pricePerNight}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="number"
          name="capacity"
          placeholder="Capacidad"
          value={formData.capacity}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="number"
          name="roomSize"
          placeholder="Tamaño de habitación (m²)"
          value={formData.roomSize}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.push("/dashboard/rooms")}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
