import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [react(), basicSsl()],

  server: {
    host: '0.0.0.0',
    port: 5173,
    https: true,

    proxy: {
      '/ws': {
        target: 'http://192.168.4.90:9090',
        changeOrigin: true,
        ws: true
      }
    }
  }
});
