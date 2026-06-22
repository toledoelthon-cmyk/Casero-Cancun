import { Building2, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { categories, locations, plans } from "@/lib/seed";

export default function RegisterBusinessPage() {
  return (
    <section className="container-page py-12">
      <SectionHeader
        eyebrow="Registrar mi negocio"
        title="Crea tu perfil para aparecer en Casero Cancún"
        description="Formulario visual inicial. En la siguiente etapa se conectará con Supabase Auth, PostgreSQL y Storage."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <Card>
          <form className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm font-bold text-casero-navy">
                Nombre del negocio
                <input className="mt-2 w-full rounded-md border border-casero-navy/10 px-3 py-2.5 font-normal outline-casero-green" placeholder="Ej. Clima Caribe Cancún" />
              </label>
              <label className="text-sm font-bold text-casero-navy">
                Tipo de perfil
                <select className="mt-2 w-full rounded-md border border-casero-navy/10 px-3 py-2.5 font-normal outline-casero-green">
                  <option>Proveedor de servicios</option>
                  <option>Tienda de materiales</option>
                </select>
              </label>
            </div>

            <label className="text-sm font-bold text-casero-navy">
              Descripción corta
              <input className="mt-2 w-full rounded-md border border-casero-navy/10 px-3 py-2.5 font-normal outline-casero-green" placeholder="Instalación y mantenimiento de aire acondicionado" />
            </label>

            <label className="text-sm font-bold text-casero-navy">
              Descripción larga
              <textarea className="mt-2 min-h-28 w-full rounded-md border border-casero-navy/10 px-3 py-2.5 font-normal outline-casero-green" placeholder="Cuéntanos qué haces, cómo trabajas y qué zonas atiendes." />
            </label>

            <div className="grid gap-5 md:grid-cols-3">
              <label className="text-sm font-bold text-casero-navy">
                WhatsApp
                <input className="mt-2 w-full rounded-md border border-casero-navy/10 px-3 py-2.5 font-normal outline-casero-green" placeholder="998..." />
              </label>
              <label className="text-sm font-bold text-casero-navy">
                Teléfono
                <input className="mt-2 w-full rounded-md border border-casero-navy/10 px-3 py-2.5 font-normal outline-casero-green" placeholder="998..." />
              </label>
              <label className="text-sm font-bold text-casero-navy">
                Email
                <input className="mt-2 w-full rounded-md border border-casero-navy/10 px-3 py-2.5 font-normal outline-casero-green" placeholder="negocio@correo.com" />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm font-bold text-casero-navy">
                Categoría principal
                <select className="mt-2 w-full rounded-md border border-casero-navy/10 px-3 py-2.5 font-normal outline-casero-green">
                  {categories.map((category) => (
                    <option key={category.slug}>{category.name}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold text-casero-navy">
                Zona principal
                <select className="mt-2 w-full rounded-md border border-casero-navy/10 px-3 py-2.5 font-normal outline-casero-green">
                  {locations.map((location) => (
                    <option key={location.slug}>{location.name}</option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <p className="text-sm font-bold text-casero-navy">Etiquetas</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {["Atiende urgencias", "Factura", "Atiende Airbnb", "Zona Hotelera", "Responde rápido", "Ofrece garantía"].map((tag) => (
                  <label key={tag} className="flex items-center gap-2 rounded-md border border-casero-navy/10 bg-casero-background px-3 py-2 text-sm text-casero-navy/75">
                    <input type="checkbox" className="h-4 w-4 accent-casero-green" />
                    {tag}
                  </label>
                ))}
              </div>
            </div>

            <Button type="button" variant="secondary" className="w-full sm:w-auto">
              Enviar perfil para revisión
            </Button>
          </form>
        </Card>

        <aside className="space-y-4">
          <Card>
            <Building2 className="h-8 w-8 text-casero-green" aria-hidden />
            <h3 className="mt-4 text-lg font-black text-casero-navy">Estado inicial</h3>
            <p className="mt-2 text-sm leading-6 text-casero-navy/65">
              Los perfiles entrarán como pendiente y podrán publicarse, pausarse o rechazarse desde el panel administrador.
            </p>
          </Card>
          <Card>
            <h3 className="text-lg font-black text-casero-navy">Planes disponibles</h3>
            <div className="mt-4 space-y-3">
              {plans.map((plan) => (
                <div key={plan.slug} className="flex items-center justify-between rounded-md bg-casero-background px-3 py-2">
                  <span className="font-bold">{plan.name}</span>
                  <span className="text-sm text-casero-navy/65">${plan.price}/mes</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <p className="flex items-center gap-2 text-sm font-bold text-casero-navy">
              <Phone className="h-4 w-4 text-casero-green" aria-hidden />
              WhatsApp visible
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm font-bold text-casero-navy">
              <Mail className="h-4 w-4 text-casero-turquoise" aria-hidden />
              Contacto directo
            </p>
          </Card>
        </aside>
      </div>
    </section>
  );
}
