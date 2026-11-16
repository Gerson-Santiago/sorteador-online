// sorteador-online/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/sorteador-online/',
  plugins: [react()],
  resolve: {
    alias: {
      features: path.resolve(__dirname, './src/features'),
      styles: path.resolve(__dirname, './src/styles'),
      theme: path.resolve(__dirname, './src/theme'),
    },
  },
  test: {
    pool: 'threads',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.js', 'src/**/*.jsx'],
    },
  },
});
