import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  //this server settig is for ngrok server testing
  server: {
    host: true, // Allow external access (required for ngrok)
    allowedHosts: [
      "d1d1b38692da.ngrok-free.app", // 👈 your current ngrok domain
    ],
  },
});
