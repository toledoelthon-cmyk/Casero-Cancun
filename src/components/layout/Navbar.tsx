import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/buscar-servicios", label: "Buscar servicios" },
  { href: "/categorias", label: "Categorías" },
  { href: "/ubicaciones", label: "Ubicaciones" },
  { href: "/planes", label: "Planes" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-casero-navy/10 bg-white/90 backdrop-blur">
      <div className="container-page flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Casero Cancún">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-casero-green text-lg font-black text-white">
            C
          </span>
          <span className="text-lg font-black text-casero-navy">Casero Cancún</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-casero-navy/75 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-casero-green">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button href="/buscar-servicios" variant="outline" className="px-4">
            <Search className="h-4 w-4" aria-hidden />
            Buscar
          </Button>
          <Button href="/registrar-mi-negocio" variant="primary">
            Registrar negocio
          </Button>
        </div>

        <button
          className="grid h-11 w-11 place-items-center rounded-md border border-casero-navy/10 bg-white text-casero-navy lg:hidden"
          type="button"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </header>
  );
}
