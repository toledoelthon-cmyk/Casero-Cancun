import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { contact, whatsappUrl } from "@/lib/contact";

const footerLinks = [
  { href: "/", label: "Inicio" },
  { href: "/buscar-servicios", label: "Buscar servicios" },
  { href: "/tiendas-y-materiales", label: "Tiendas y materiales" },
  { href: "/mascotas", label: "Mascotas" },
  { href: "/servicios-para-tu-auto", label: "Servicios para tu auto" },
  { href: "/categorias", label: "Categorías" },
  { href: "/planes", label: "Planes" },
  { href: "/registrar-mi-negocio", label: "Registrar negocio" },
  { href: "/contacto", label: "Contacto" },
  { href: "/aviso-de-privacidad", label: "Aviso de privacidad" },
  { href: "/terminos-y-condiciones", label: "Términos y condiciones" },
];

export function Footer() {
  return (
    <footer className="border-t border-casero-dark/10 bg-casero-dark text-white">
      <Container className="grid gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr_1fr]">
        <div>
          <p className="font-heading text-xl font-extrabold">{contact.brand}</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
            Servicios, tiendas, mascotas y soluciones para tu auto en Cancún.
          </p>
          <p className="mt-5 text-xs leading-5 text-white/50">
            Casero Cancún funciona como plataforma de conexion. Cada proveedor, tienda o negocio es responsable de la
            informacion publicada y de los servicios o productos que ofrece.
          </p>
        </div>

        <div>
          <p className="font-heading text-sm font-bold uppercase text-white/55">Contacto</p>
          <div className="mt-4 grid gap-3 text-sm">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-white/75 hover:text-white"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              WhatsApp: {contact.whatsappDisplay}
            </a>
            <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-white/75 hover:text-white">
              <Mail className="h-4 w-4" aria-hidden />
              {contact.email}
            </a>
          </div>
        </div>

        <nav className="grid gap-3 text-sm sm:grid-cols-2">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-white/75 hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
      <div className="border-t border-white/10 py-4">
        <Container className="text-sm text-white/55">(c) 2026 Casero Cancún. Hecho para negocios locales.</Container>
      </div>
    </footer>
  );
}
