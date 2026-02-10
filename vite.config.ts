import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      // Figma asset imports
      'figma:asset/f85d096177bad17676da47be64c08e159cab1459.png': path.resolve(__dirname, './src/assets/f85d096177bad17676da47be64c08e159cab1459.png'),
      'figma:asset/a43c611d37822e3c55c5a52c5b87570b07694286.png': path.resolve(__dirname, './src/assets/a43c611d37822e3c55c5a52c5b87570b07694286.png'),
      'figma:asset/a16ddc572b7ee405d3b37b68281ef58b6fe71317.png': path.resolve(__dirname, './src/assets/a16ddc572b7ee405d3b37b68281ef58b6fe71317.png'),
      'figma:asset/805a6f3508cf622cb9159868a1a587509b739f95.png': path.resolve(__dirname, './src/assets/805a6f3508cf622cb9159868a1a587509b739f95.png'),
      'figma:asset/19038c1dd76bf683ea870921e1a2fe532d0716bd.png': path.resolve(__dirname, './src/assets/19038c1dd76bf683ea870921e1a2fe532d0716bd.png'),
      'figma:asset/180b5e132ef1b8c3b08ec78e87b2b07cb42e0a6c.png': path.resolve(__dirname, './src/assets/180b5e132ef1b8c3b08ec78e87b2b07cb42e0a6c.png'),
      // Path alias
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
    sourcemap: false,
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion-vendor': ['motion'],
          'radix-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
          ],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    open: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'motion'],
  },
});
