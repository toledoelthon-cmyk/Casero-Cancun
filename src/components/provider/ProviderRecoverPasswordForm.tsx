"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function ProviderRecoverPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase no esta configurado.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/proveedor/actualizar-password`,
    });

    if (resetError) {
      setError(resetError.message || "No pudimos enviar el enlace de recuperacion.");
      setLoading(false);
      return;
    }

    setMessage("Si el correo esta registrado, recibiras un enlace para actualizar tu contrasena.");
    setLoading(false);
  }

  return (
    <Card className="w-full p-5 shadow-soft sm:p-7">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-casero-green">Proveedores</p>
        <h1 className="mt-3 font-heading text-2xl font-extrabold text-casero-dark sm:text-3xl">
          Recuperar contraseña
        </h1>
        <p className="mt-3 text-sm leading-6 text-casero-text/70">
          Te enviaremos un enlace para actualizar tu contraseña.
        </p>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <label className="text-sm font-bold text-casero-dark">
          Correo
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2.5 font-normal outline-casero-green"
            type="email"
            autoComplete="email"
            required
          />
        </label>

        {error ? <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
        {message ? <p className="rounded-md bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{message}</p> : null}

        <Button type="submit" variant="secondary" disabled={loading}>
          {loading ? "Enviando..." : "Enviar enlace de recuperación"}
        </Button>
      </form>

      <div className="mt-5 grid gap-3 text-sm font-bold">
        <Link href="/proveedor/login" className="text-casero-green underline-offset-4 hover:underline">
          Volver a iniciar sesión
        </Link>
      </div>
    </Card>
  );
}
