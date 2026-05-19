import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QR Restaurante",
  description: "La forma más fácil de gestionar tu restaurante y pedidos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}