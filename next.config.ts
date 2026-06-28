import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gera build auto-contido (server.js + node_modules mínimo) para imagem Docker enxuta.
  output: "standalone",
  // Permite que o servidor de desenvolvimento aceite requisições vindas de túneis
  // (ex.: ngrok) — sem isso o Next bloqueia os assets de dev de outras origens e a
  // página fica preta/branca porque o React não hidrata.
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok.app",
    "*.ngrok.io",
    // IP da máquina na rede local (acesso pela URL "Network", ex.: testar no celular).
    "192.168.0.9",
  ],
};

export default nextConfig;
