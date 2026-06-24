import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppFloatingButton } from "@/components/layout/WhatsAppFloatingButton";

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

export const metadata: Metadata = {
  title: "Casero Cancun | Servicios locales, tiendas, mascotas y auto",
  description:
    "Encuentra servicios locales Cancun, tiendas y materiales Cancun, mascotas Cancun y servicios automotrices Cancun con contacto directo por WhatsApp.",
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
      </body>
    </html>
  );
}
