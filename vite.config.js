import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite conexões de qualquer IP
    port: 3333,        // Porta 80
  },
  preview: {
    allowedHosts: ['ti-cds'], // Adiciona "ti-cds" aos hosts permitidos
  },
})