// Configuração padrão do Vite para React. Não precisa de proxy se usar VITE_API_URL.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})