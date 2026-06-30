import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Casero Cancún",
    short_name: "Casero",
    description: "Servicios, proveedores y negocios locales en Cancún.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#FAFAF7",
    theme_color: "#1F8A5B",
    orientation: "portrait",
    categories: ["business", "utilities", "lifestyle"],
    lang: "es-MX",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/maskable-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/maskable-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
