import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/buscar-servicios", label: "Buscar servicios" },
  { href: "/tiendas-y-materiales", label: "Tiendas y materiales" },
  { href: "/mascotas", label: "Mascotas" },
  { href: "/servicios-para-tu-auto", label: "Servicios para tu auto" },
  { href: "/planes", label: "Planes" },
  { href: "/registrar-mi-negocio", label: "Registrar negocio" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-casero-dark/10 bg-white/92 backdrop-blur">
      <Container className="flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Casero Cancun">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-casero-green font-heading text-lg font-extrabold text-white">
            C
          </span>
          <span className="font-heading text-lg font-extrabold text-casero-dark">Casero Cancun</span>
        </Link>

        <nav className="hidden items-center gap-4 text-sm font-semibold text-casero-text/75 2xl:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-casero-green">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden 2xl:block">
          <Button href="/registrar-mi-negocio" variant="primary">
            Registrar negocio
          </Button>
        </div>

        <details className="group 2xl:hidden">
          <summary className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-md border border-casero-dark/10 bg-white text-casero-dark marker:hidden">
            <span className="sr-only">Abrir menu</span>
            <Menu className="h-5 w-5 group-open:hidden" aria-hidden />
            <X className="hidden h-5 w-5 group-open:block" aria-hidden />
          </summary>
          <div className="absolute left-0 right-0 top-16 border-t border-casero-dark/10 bg-white shadow-soft">
            <Container className="grid gap-1 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-3 text-sm font-semibold text-casero-text hover:bg-casero-background"
                >
                  {link.label}
                </Link>
              ))}
              <Button href="/registrar-mi-negocio" className="mt-2 w-full">
                Registrar negocio
              </Button>
            </Container>
          </div>
        </details>
      </Container>
    </header>
  );
}
