"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError("Correo o contrasena incorrectos.");
      setLoading(false);
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      await supabase.auth.signOut();
      setError("No pudimos validar tu sesion.");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || profile?.role !== "admin") {
      await supabase.auth.signOut();
      setError("No tienes permisos para acceder al panel administrativo.");
      setLoading(false);
      return;
    }

    router.replace("/admin/negocios");
    router.refresh();
  }

  return (
    <Card className="w-full p-5 shadow-soft sm:p-7">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-casero-green">Administracion</p>
        <h1 className="mt-3 font-heading text-2xl font-extrabold text-casero-dark sm:text-3xl">
          Iniciar sesion
        </h1>
        <p className="mt-3 text-sm leading-6 text-casero-text/70">
          Accede con tu cuenta autorizada para revisar y publicar negocios.
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

        <label className="text-sm font-bold text-casero-dark">
          Contrasena
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2.5 font-normal outline-casero-green"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>

        {error ? <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}

        <Button type="submit" variant="secondary" disabled={loading}>
          {loading ? "Iniciando..." : "Iniciar sesion"}
        </Button>
      </form>
    </Card>
  );
}
