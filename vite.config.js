import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      features: path.resolve(__dirname, './src/features'),
      styles: path.resolve(__dirname, './src/styles'),
      theme: path.resolve(__dirname, './src/theme'),
    },
  },
});
