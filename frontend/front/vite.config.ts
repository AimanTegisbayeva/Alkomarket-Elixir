import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // необходимо для работы в Docker
    port: 5173,
    watch: {
      usePolling: true, // гарантирует обновление страниц (HMR) внутри Docker на Windows/Mac
    },
  },
})
