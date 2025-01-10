import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000,
    proxy: {
      '/api': 'https://ai-data-model-tool-backend-davidn22s-projects.vercel.app',
    },
  },
});

