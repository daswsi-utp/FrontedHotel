'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import api from "../../gateway-services/ConnectionService";

interface RoomType {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

export default function CreateRoomModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    roomNumber: "",
    pricePerNight: "",
    capacity: "",
    roomSize: "",
    description: "",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [roomTypeSelected, setRoomTypeSelected] = useState<RoomType | null>(null);
  const [tagsSelected, setTagsSelected] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);


  useEffect(() => {
    api.get(`/api/rooms/roomtype`).then((res) => {
      setRoomTypes(res.data);
    });

    api.get(`/api/rooms/tags`).then((res) => {
      setTags(res.data);
    });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    setMainImageIndex(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!imageFiles.length || !roomTypeSelected) {
      alert("Faltan imágenes o tipo de habitación");
      return;
    }

    const roomDataToSend = {
      roomNumber: parseInt(formData.roomNumber),
      roomType: {
        id: roomTypeSelected.id,
        name: roomTypeSelected.name,
      },
      pricePerNight: parseFloat(formData.pricePerNight),
      capacity: parseInt(formData.capacity),
      roomSize: parseFloat(formData.roomSize),
      description: formData.description,
    };

    const formDataToSend = new FormData();
    formDataToSend.append(
  "room",
  new Blob(
    [JSON.stringify(roomDataToSend)],
    { type: "application/json" }
  )
);

    imageFiles.forEach((file) => {
      formDataToSend.append("images", file);
    });

    tagsSelected.forEach((tag) => {
      formDataToSend.append("tags", tag);
    });

    try {
      await api.post(`/api/rooms/rooms`, formDataToSend);
      alert("Habitación creada");
      onClose();
      window.location.reload();
    } catch (err) {
      console.error("Error al crear habitación:", err);
      alert("Error al guardar habitación");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 relative">
        <h2 className="text-2xl font-bold mb-4 text-center">Crear Habitación</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              name="roomNumber"
              placeholder="Número"
              value={formData.roomNumber}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2 w-full"
            />

            <select
              value={roomTypeSelected?.id || ""}
              onChange={(e) => {
                const selected = roomTypes.find(rt => rt.id === parseInt(e.target.value));
                setRoomTypeSelected(selected || null);
              }}
              required
              className="border rounded px-3 py-2 w-full"
            >
              <option value="">Tipo de habitación</option>
              {roomTypes.map(rt => (
                <option key={rt.id} value={rt.id}>{rt.name}</option>
              ))}
            </select>

            <input
              type="number"
              name="pricePerNight"
              placeholder="Precio por noche"
              value={formData.pricePerNight}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2 w-full"
            />

            <input
              type="number"
              name="capacity"
              placeholder="Capacidad"
              value={formData.capacity}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2 w-full"
            />

            <input
              type="number"
              name="roomSize"
              placeholder="Tamaño (m²)"
              value={formData.roomSize}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <textarea
            name="description"
            placeholder="Descripción"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="border rounded px-3 py-2 w-full"
          />

          <div>
            <label className="text-sm font-medium">Imágenes (puedes subir varias)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              required
              className="w-full mt-1"
            />
            {imageFiles.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-3">
                {imageFiles.map((file, index) => (
                  <div
                    key={index}
                    className={`relative border rounded overflow-hidden cursor-pointer ${
                      mainImageIndex === index ? 'ring-4 ring-blue-500' : ''
                    }`}
                    onClick={() => setMainImageIndex(index)}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`img-${index}`}
                      className="w-full h-24 object-cover"
                    />
                    {mainImageIndex === index && (
                      <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs px-2 py-1">
                        Principal
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
          </div>

              
          <div>
            <label className="text-sm font-medium">Etiquetas</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <label key={tag.id} className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    value={tag.name}
                    checked={tagsSelected.includes(tag.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTagsSelected([...tagsSelected, tag.name]);
                      } else {
                        setTagsSelected(tagsSelected.filter(t => t !== tag.name));
                      }
                    }}
                  />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
        >
          ×
        </button>
      </div>
    </div>
  );
}
