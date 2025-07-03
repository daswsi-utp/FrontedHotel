import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL!

const api = axios.create({
  baseURL: API_URL,
})

// Interceptor para añadir automáticamente el Bearer Token
api.interceptors.request.use((config) => {
  if (typeof document !== 'undefined') {
    const raw = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='))
    const token = raw?.split('=')[1]
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export default api
