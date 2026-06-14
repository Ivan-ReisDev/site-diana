import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gera build auto-contido (server.js + node_modules mínimo) para imagem Docker enxuta.
  output: "standalone",
};

export default nextConfig;
