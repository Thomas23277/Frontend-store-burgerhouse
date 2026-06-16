import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      // es-toolkit/compat es un reemplazo drop-in de lodash
      // pero su CJS interno no se lleva bien con esbuild.
      // Redirigimos a lodash-es que es ESM nativo.
      {
        find: /^es-toolkit\/compat\/(.+)$/,
        replacement: 'lodash-es/$1',
      },
    ],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true,
      },
    },
  },
})
