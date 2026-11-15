// I import the plugin that adds React support to Vite.
import react from '@vitejs/plugin-react'
// I use defineConfig to describe the settings in the format Vite expects.
import { defineConfig } from 'vite'

// I use the React plugin so Vite can read my JSX files.
export default defineConfig({
  // I keep the existing Vite settings and only enable the React plugin.
  // I call react() to create the plugin and put it in the plugins array.
  // I keep the development port in the npm dev script rather than setting it here.
  plugins: [react()],
})
