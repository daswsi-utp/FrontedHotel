'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL!; // e.g. http://localhost:8090/api

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password } = formData;
    if (!username || !password) {
      alert('Por favor completa todos los campos.');
      return;
    }

    try {
      // 1️⃣ Login (OAuth)
      const loginResp = await axios.post(
        `${API_URL}/oauth/login`,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const token = loginResp.data.access_token;
      localStorage.setItem('access_token', token);

      // 2️⃣ Decodificar JWT para extraer sub (username) y roles
      const base64 = token.split('.')[1];
      const payload: { sub: string; roles?: string[] } = JSON.parse(atob(base64));
      const roles = payload.roles || [];
      const loggedUsername = payload.sub;

      // 3️⃣ Obtener datos del usuario
      const userResp = await axios.get(
        `${API_URL}/users/username/${encodeURIComponent(loggedUsername)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const user = userResp.data;
      // (Opcional) almacenar user en contexto o state global

      // 4️⃣ Redirección según rol
      if (roles.includes('ROLE_ADMIN')) {
        router.push('/admin/dashboard');
      } else if (roles.includes('ROLE_USER')) {
        router.push('http://localhost:3000/');
      } else {
        alert('Rol no reconocido. Contacta al administrador.');
      }

    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || 'Error en login. Intenta de nuevo.');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Sign In</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="mt-1 flex items-center border border-gray-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400">
              <Mail className="w-5 h-5 text-gray-400 mr-2" />
              <input
                id="username"
                type="text"
                className="flex-1 outline-none"
                placeholder="JohnDoe1"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 flex items-center border border-gray-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400">
              <Lock className="w-5 h-5 text-gray-400 mr-2" />
              <input
                id="password"
                type="password"
                className="flex-1 outline-none"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-xl hover:bg-indigo-700 transition"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{' '}
          <Link href="/auth/register" className="underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
