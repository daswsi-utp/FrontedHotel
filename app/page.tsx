import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Hero */}
      <section className="relative h-[90vh] flex items-center justify-center bg-black">
        <Image
          src="/hotel-hero.jpg"
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
              href="/rooms"
              className="bg-transparent border border-white text-white font-semibold px-6 py-3 rounded-xl hover:bg-white hover:text-black transition"
            >
              Ver Habitaciones
            </Link>
          </div>
        </div>
      </section>

      {/* Carrusel de información */}
      <section className="py-20 px-4 md:px-20 bg-white">
        <h2 className="text-3xl font-bold mb-10 text-center">¿Por qué elegir Munay Wasi?</h2>
        <div className="flex overflow-x-auto space-x-6 snap-x snap-mandatory scrollbar-hide">
          {[
            {
    title: "Personalized Service",
    desc: "Our team is available 24/7 to ensure an unforgettable experience.",
    icon: "💁‍♀️",
  },
  {
    title: "Prime Location",
    desc: "Strategically located near cultural and tourist attractions.",
    icon: "📍",
  },
  {
    title: "Cozy Atmosphere",
    desc: "Spaces designed for your comfort with a Peruvian touch.",
    icon: "🏡",
  },
  {
    title: "Local Cuisine",
    desc: "Enjoy traditional Peruvian dishes made with fresh ingredients.",
    icon: "🍽️",
  },
  {
    title: "Tours & Activities",
    desc: "We organize unique experiences like city tours, hikes, and more.",
    icon: "🎒",
  },
  {
    title: "Wi-Fi & Comfort",
    desc: "High-speed internet, cozy beds, and relaxing common areas.",
    icon: "📶",
  },
  {
    title: "Guaranteed Safety",
    desc: "Security protocols and monitoring ensure peace of mind.",
    icon: "🛡️",
  },
          ].map((item, i) => (
            <div
              key={i}
              className="min-w-[280px] bg-blue-50 rounded-xl shadow-md p-6 snap-center flex-shrink-0"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-900">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sección Sobre Nosotros */}
      <section className="py-16 px-4 md:px-20 bg-gray-100">
        <h2 className="text-3xl font-bold mb-10 text-center">Sobre Nosotros</h2>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <Image
              src="/about-hotel.jpg"
              alt="Sobre Munay Wasi"
              width={500}
              height={300}
              className="rounded-xl object-cover w-full"
            />
          </div>
          <div>
            <p className="text-gray-700 text-lg leading-relaxed">
              Munay Wasi nace con la visión de brindar experiencias auténticas en cada rincón del Perú.
              Nuestro compromiso es ofrecerte una estadía cómoda, segura y culturalmente enriquecedora,
              combinando tradición con modernidad.
            </p>
            <p className="text-gray-600 mt-4">
              Ya sea por trabajo o vacaciones, tenemos el espacio perfecto para ti.
              Descubre el encanto de nuestros destinos y siéntete como en casa.
            </p>
            <Link href="/about">
              <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Conoce más
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer mejorado */}
      <footer className="bg-blue-900 text-white py-12 px-6 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Hotel Info */}
          <div>
            <h3 className="text-yellow-400 font-bold text-xl mb-4">✦ Munay Wasi</h3>
            <p className="text-sm text-gray-300">
              Experience luxury and comfort in our exquisite hotel, offering stunning views and unparalleled service for an unforgettable stay.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-yellow-400 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li><Link href="/dashboard/rooms" className="hover:underline">Our Rooms</Link></li>
              <li><Link href="/login" className="hover:underline">Book Now</Link></li>
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-yellow-400 font-semibold mb-4">Contact Us</h4>
            <ul className="text-sm space-y-2 text-gray-300">
              <li>📍 123 Paradise Lane, Beachfront Avenue, Tropical Island</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>📧 info@hotelMunayWasi.com</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-yellow-400 font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-gray-300 mb-4">Subscribe to our newsletter for special deals, exclusive offers, and updates.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full p-2 rounded-l-md text-black bg-white"
              />
              <button type="submit" className="bg-yellow-400 text-black font-semibold px-4 rounded-r-md hover:bg-yellow-300 transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-12 text-center border-t border-gray-600 pt-6 text-sm text-gray-400">
          <p>&copy; 2025 Hotel Paraiso. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="#" className="hover:text-white">🌐</a>
            <a href="#" className="hover:text-white">🔗</a>
            <a href="#" className="hover:text-white">📸</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
