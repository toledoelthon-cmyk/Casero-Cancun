import Link from "next/link";

const footerLinks = [
  { href: "/buscar-servicios", label: "Servicios" },
  { href: "/tiendas-y-materiales", label: "Tiendas y materiales" },
  { href: "/registrar-mi-negocio", label: "Registrar negocio" },
  { href: "/contacto", label: "Contacto" },
];

export function Footer() {
  return (
    <footer className="border-t border-casero-navy/10 bg-casero-navy text-white">
      <div className="container-page grid gap-8 py-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-xl font-black">Casero Cancún</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
            El directorio local confiable para resolver reparaciones, mantenimiento y mejoras del
            hogar en Cancún.
          </p>
        </div>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-white/75 hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 py-4">
        <div className="container-page text-sm text-white/55">
          © 2026 Casero Cancún. Hecho para proveedores locales.
        </div>
      </div>
    </footer>
  );
}
