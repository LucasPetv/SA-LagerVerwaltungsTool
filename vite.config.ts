import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: './', // Wichtig für Electron
      server: {
        port: 5174, // Different port to avoid conflicts
        host: '0.0.0.0',
        strictPort: true, // Kein automatisches Port-Switching
      },
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
          external: ['mysql2', 'mysql2/promise', 'bcryptjs', 'jsonwebtoken', 'crypto'] // Externalize Node.js modules for browser
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        global: 'globalThis', // Browser compatibility
        'process.env.NODE_ENV': JSON.stringify(mode)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          '@features': path.resolve(__dirname, 'src/features'),
          '@shared': path.resolve(__dirname, 'src/shared'),
          '@config': path.resolve(__dirname, 'src/config'),
          // Browser-Fallbacks für Node.js Module
          'crypto': 'crypto-browserify',
          'util': 'util',
          'buffer': 'buffer',
        }
      },
      optimizeDeps: {
        exclude: ['mysql2', 'mysql2/promise', 'bcryptjs', 'jsonwebtoken'] // Don't try to optimize Node.js modules
      }
    };
});
