import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'log-dev-server-url',
      configureServer(server) {
        server.httpServer?.once('listening', () => {
          const info = server.httpServer?.address();
          const protocol = server.config.server.https ? 'https' : 'http';

          let host = 'localhost';
          let port = 5173;

          if (typeof info === 'object' && info?.port) {
            port = info.port;
            host = info.address === '::' ? 'localhost' : info.address;
          }

          console.log(`\n🚀 Dev server running at: ${protocol}://${host}:${port}\n`);
        });
      }
    }
  ],
  server: {
    port: 5173,
    host: true // This allows access from network IP too
  }
});
