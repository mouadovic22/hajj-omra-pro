import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base = "/hajj-omra-pro/" pour GitHub Pages (mouadovic22.github.io/hajj-omra-pro/)
// → passer à "/" si un domaine personnalisé est ajouté plus tard
export default defineConfig({
  plugins: [react()],
  base: "/hajj-omra-pro/",
});
