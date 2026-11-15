import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// I use the React plugin so Vite can read my JSX files.
export default defineConfig({
  // I keep the existing Vite settings and only enable the React plugin.
  plugins: [react()],
})
