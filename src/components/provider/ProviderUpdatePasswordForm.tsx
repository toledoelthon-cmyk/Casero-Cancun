"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function ProviderUpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checkingLink, setCheckingLink] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function prepareRecoverySession() {
      const supabase = createSupabaseBrowserClient();

      if (!supabase) {
        if (mounted) {
          setError("Supabase no esta configurado.");
          setCheckingLink(false);
        }
        return;
      }

      const code = new URLSearchParams(window.location.search).get("code");

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          if (mounted) {
            setError("El enlace no es valido o expiro. Solicita uno nuevo.");
            setHasValidSession(false);
            setCheckingLink(false);
          }
          return;
        }

        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted) {
        setHasValidSession(Boolean(session));
        setError(session ? null : "El enlace no es valido o expiro. Solicita uno nuevo.");
        setCheckingLink(false);
      }
    }

    prepareRecoverySession();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasValidSession) {
      setError("El enlace no es valido o expiro. Solicita uno nuevo.");
      return;
    }

    if (password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contrasenas deben coincidir.");
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase no esta configurado.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message || "No pudimos actualizar tu contrasena.");
      setLoading(false);
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setMessage("Contraseña actualizada correctamente.");
    setLoading(false);
  }

  return (
    <Card className="w-full p-5 shadow-soft sm:p-7">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-casero-green">Proveedores</p>
        <h1 className="mt-3 font-heading text-2xl font-extrabold text-casero-dark sm:text-3xl">
          Actualizar contraseña
        </h1>
        <p className="mt-3 text-sm leading-6 text-casero-text/70">
          Escribe una contraseña nueva para tu cuenta de proveedor.
        </p>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <label className="text-sm font-bold text-casero-dark">
          Nueva contraseña
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2.5 font-normal outline-casero-green"
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
            disabled={checkingLink || !hasValidSession || Boolean(message)}
          />
        </label>

        <label className="text-sm font-bold text-casero-dark">
          Confirmar contraseña
          <input
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2.5 font-normal outline-casero-green"
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
            disabled={checkingLink || !hasValidSession || Boolean(message)}
          />
        </label>

        {error ? <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
        {message ? <p className="rounded-md bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{message}</p> : null}

        {message ? (
          <Button href="/proveedor/login" variant="secondary">
            Iniciar sesión
          </Button>
        ) : (
          <Button type="submit" variant="secondary" disabled={loading || checkingLink || !hasValidSession}>
            {checkingLink ? "Validando enlace..." : loading ? "Actualizando..." : "Actualizar contraseña"}
          </Button>
        )}
      </form>

      <div className="mt-5 grid gap-3 text-sm font-bold">
        <Link href="/proveedor/recuperar-password" className="text-casero-green underline-offset-4 hover:underline">
          Solicitar un enlace nuevo
        </Link>
        <Link href="/proveedor/login" className="text-casero-green underline-offset-4 hover:underline">
          Volver a iniciar sesión
        </Link>
      </div>
    </Card>
  );
}
