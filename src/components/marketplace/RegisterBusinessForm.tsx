"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { categories, locations, plans } from "@/lib/demo-data";

export function RegisterBusinessForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <Card>
      {submitted ? (
        <div className="mb-5 rounded-md border border-casero-green/20 bg-casero-green/10 p-4 text-sm font-semibold text-casero-green">
          Solicitud recibida visualmente. En la siguiente fase conectaremos este formulario a Supabase.
        </div>
      ) : null}

      <form className="grid gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-bold text-casero-dark">
            Nombre del negocio
            <input className="mt-2 w-full rounded-md border border-casero-dark/10 px-3 py-2.5 font-normal outline-casero-green" placeholder="Ej. Plomería Express del Caribe" />
          </label>
          <label className="text-sm font-bold text-casero-dark">
            Nombre del responsable
            <input className="mt-2 w-full rounded-md border border-casero-dark/10 px-3 py-2.5 font-normal outline-casero-green" placeholder="Nombre y apellido" />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-bold text-casero-dark">
            WhatsApp
            <input className="mt-2 w-full rounded-md border border-casero-dark/10 px-3 py-2.5 font-normal outline-casero-green" placeholder="998..." />
          </label>
          <label className="text-sm font-bold text-casero-dark">
            Correo
            <input className="mt-2 w-full rounded-md border border-casero-dark/10 px-3 py-2.5 font-normal outline-casero-green" placeholder="negocio@correo.com" />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-bold text-casero-dark">
            Tipo de perfil
            <select className="mt-2 w-full rounded-md border border-casero-dark/10 px-3 py-2.5 font-normal outline-casero-green">
              <option>Proveedor de servicio</option>
              <option>Tienda o materiales</option>
            </select>
          </label>
          <label className="text-sm font-bold text-casero-dark">
            Categoría principal
            <select className="mt-2 w-full rounded-md border border-casero-dark/10 px-3 py-2.5 font-normal outline-casero-green">
              {categories.map((category) => (
                <option key={category.slug}>{category.name}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-bold text-casero-dark">
            Zona de atención
            <select className="mt-2 w-full rounded-md border border-casero-dark/10 px-3 py-2.5 font-normal outline-casero-green">
              {locations.map((location) => (
                <option key={location.slug}>{location.name}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-bold text-casero-dark">
            Plan de interés
            <select className="mt-2 w-full rounded-md border border-casero-dark/10 px-3 py-2.5 font-normal outline-casero-green">
              {plans.map((plan) => (
                <option key={plan.slug}>
                  {plan.name} - ${plan.price} MXN/mes
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="text-sm font-bold text-casero-dark">
          Descripción breve
          <textarea className="mt-2 min-h-24 w-full rounded-md border border-casero-dark/10 px-3 py-2.5 font-normal outline-casero-green" placeholder="Qué haces, qué vendes o qué tipo de clientes atiendes." />
        </label>

        <label className="text-sm font-bold text-casero-dark">
          Mensaje adicional
          <textarea className="mt-2 min-h-24 w-full rounded-md border border-casero-dark/10 px-3 py-2.5 font-normal outline-casero-green" placeholder="Cuéntanos si atiendes urgencias, Airbnb, Zona Hotelera o si tienes alguna duda." />
        </label>

        <Button type="submit" variant="secondary" className="w-full sm:w-auto">
          Enviar solicitud
        </Button>
      </form>
    </Card>
  );
}
