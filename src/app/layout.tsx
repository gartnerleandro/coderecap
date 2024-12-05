import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";

const poppins = Poppins({ weight: ["400", "600"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Code recap 2024 - Comparte tus estadísticas de GitHub",
  description:
    "Crea y comparte tu tarjeta de desarrollador con estadísticas de GitHub. Muestra tus contribuciones, lenguajes favoritos y más.",
  keywords: ["github stats", "developer card", "portfolio", "github profile"],
  openGraph: {
    title: "Code recap 2024 - Estadísticas de GitHub",
    description: "Crea y comparte tu tarjeta de desarrollador",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Code recap 2024 - Estadísticas de GitHub",
    description: "Crea y comparte tu tarjeta de desarrollador",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
