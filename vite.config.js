// vite.config.js
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      features: path.resolve(__dirname, './src/features'),
      styles: path.resolve(__dirname, './src/styles'),
      theme: path.resolve(__dirname, './src/theme'),
    },
  },
});
