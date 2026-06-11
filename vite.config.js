import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "/hajj-omra-pro/" tant que le DNS manasik.info n'est pas actif
// → passer à "/" une fois le domaine personnalisé configuré dans GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: "/hajj-omra-pro/",
});
