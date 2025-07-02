// app/page.tsx

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Hero */}
      <section className="relative h-[90vh] flex items-center justify-center bg-black">
        <Image
          src="/hotel-hero.jpg" // Asegúrate de tener esta imagen en /public
          alt="Hotel Hero"
          layout="fill"
          objectFit="cover"
          className="opacity-70"
        />
        <div className="z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            WELCOME MUNAY WASI 
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Vive la mejor experiencia en cada estadía.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/auth/login"
              className="bg-white text-black font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-gray-200 transition"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/dashboard/rooms"
              className="bg-transparent border border-white text-white font-semibold px-6 py-3 rounded-xl hover:bg-white hover:text-black transition"
            >
              Ver Habitaciones
            </Link>
          </div>
        </div>
      </section>

      {/* Sección de habitaciones destacadas */}
      <section className="py-20 px-4 md:px-20 bg-gray-100">
        <h2 className="text-3xl font-bold mb-10 text-center">Habitaciones Destacadas</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <Image
                src={`/room-${num}.jpg`} // Debes colocar estas imágenes en /public
                alt={`Room ${num}`}
                width={400}
                height={250}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">Habitación Deluxe {num}</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Comodidad, estilo y vistas espectaculares. Ideal para descansar.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

     {/* Departamentos disponibles en Perú */}
<section className="py-16 px-4 md:px-20 bg-white">
  <h2 className="text-3xl font-bold mb-10 text-center">Departamentos Disponibles en Perú</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {[
      {
        id: 1,
        title: "Departamento en Miraflores",
        location: "Lima",
        price: "S/ 280 por noche",
        img: "/peru-1.jpg",
      },
      {
        id: 2,
        title: "Suite con vista al volcán",
        location: "Arequipa",
        price: "S/ 220 por noche",
        img: "/peru-2.jpg",
      },
      {
        id: 3,
        title: "Hospedaje ecológico",
        location: "Cusco",
        price: "S/ 190 por noche",
        img: "/peru-3.jpg",
      },
    ].map((dpto) => (
      <div
        key={dpto.id}
        className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition"
      >
        <Image
          src={dpto.img}
          alt={dpto.title}
          width={400}
          height={250}
          className="w-full h-56 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold">{dpto.title}</h3>
          <p className="text-sm text-gray-600">{dpto.location}</p>
          <p className="text-md font-medium text-black mt-2">{dpto.price}</p>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Reservar
          </button>
        </div>
      </div>
    ))}
  </div>
</section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6">
        <p>&copy; 2025 Hotel Paraiso. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}
