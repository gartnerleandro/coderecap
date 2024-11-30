import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Code recap 2024",
  description: "Todo el recorrido de tu código durante el año 2024",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
