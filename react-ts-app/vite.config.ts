import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import glsl from 'vite-plugin-glsl';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), glsl()],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, './src/assets')
    }
  }
})
