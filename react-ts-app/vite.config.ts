import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import glsl from 'vite-plugin-glsl';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), glsl()],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@DI': path.resolve(__dirname, './src/data_interfaces'),
      '@DS': path.resolve(__dirname, './src/data_services')
    }
  }
})
