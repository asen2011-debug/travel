import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // 相对路径构建，可部署到 GitHub Pages 的任意子路径（无需预知仓库名）
  base: './',
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 4731,
  },
  preview: {
    host: '0.0.0.0',
    port: 4732,
    allowedHosts: ['.loca.lt'],
  },
})
