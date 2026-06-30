import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppFloatingButton } from "@/components/layout/WhatsAppFloatingButton";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { createPublicMetadata } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = createPublicMetadata({
  title: "Casero Cancún | Servicios locales, tiendas, mascotas y auto",
  description:
    "Encuentra servicios del hogar, proveedores locales, tiendas de materiales, mascotas y servicios automotrices en Cancún con contacto directo por WhatsApp.",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1F8A5B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloatingButton />
        <InstallPrompt />
      </body>
    </html>
  );
}
