import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/group-expense-splitter/',
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
  },
})