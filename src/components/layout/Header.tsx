"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
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
  { href: "/proveedor/login", label: "Proveedores" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-casero-dark/10 bg-white/92 backdrop-blur">
      <Container className="flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-2" aria-label="Casero Cancún" onClick={closeMenu}>
          <span className="grid h-10 w-10 place-items-center rounded-md bg-casero-green font-heading text-lg font-extrabold text-white">
            C
          </span>
          <span className="truncate font-heading text-lg font-extrabold text-casero-dark">Casero Cancún</span>
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

        <div className="2xl:hidden">
          <button
            className="grid h-11 w-11 place-items-center rounded-md border border-casero-dark/10 bg-white text-casero-dark"
            type="button"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
          >
            {isOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
          {isOpen ? (
            <div className="absolute left-0 right-0 top-16 max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-casero-dark/10 bg-white shadow-soft">
              <Container className="grid gap-1 py-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-3.5 text-base font-semibold text-casero-text hover:bg-casero-background"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/registrar-mi-negocio"
                className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-casero-orange px-5 py-2.5 text-sm font-semibold text-casero-dark shadow-soft"
                onClick={closeMenu}
              >
                Registrar negocio
              </Link>
            </Container>
            </div>
          ) : null}
        </div>
      </Container>
    </header>
  );
}

