import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "/" pour domaine personnalisé manasik.info
export default defineConfig({
  plugins: [react()],
  base: "/",
});
