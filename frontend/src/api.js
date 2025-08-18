// api.js: centraliza a configuração do Axios (baseURL e token JWT).
import axios from 'axios'

// Usa a URL da API definida no .env (ex.: http://localhost:5000)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Interceptor para anexar o token JWT automaticamente, se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api