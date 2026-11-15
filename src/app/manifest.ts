import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GuiaMove — @dansouza.move",
    short_name: "GuiaMove",
    description:
      "Ferramentas gratuitas de rotina, autonomia e movimento por @dansouza.move",
    start_url: "/",
    display: "standalone",
    background_color: "#F0F9FF",
    theme_color: "#0284C7",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
