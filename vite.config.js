import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // DEV-BOT switches from the SVG fallback to Rive when this file exists
    __HAS_RIVE__: JSON.stringify(fs.existsSync('public/rive/devbot.riv')),
  },
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
  ssr: {
    // bundle these into the SSR entry so their ESM/CSS quirks don't matter in Node
    noExternal: ['framer-motion', 'lucide-react', 'gsap'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://mjre-portfolio.vercel.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
