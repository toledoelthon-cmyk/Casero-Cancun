"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthMode = "login" | "register";

async function ensureProviderProfile(user: User, fullName: string) {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    return { ok: false, message: "Supabase no esta configurado." };
  }

  const normalizedEmail = user.email?.trim() || null;
  const metadataFullName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "";
  const normalizedName = fullName.trim() || metadataFullName || normalizedEmail || "Proveedor";

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("id,email,full_name,role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("provider profile lookup failed", {
      message: profileError.message,
      details: profileError.details,
      hint: profileError.hint,
      code: profileError.code,
      fullError: profileError,
    });
    return { ok: false, message: "No pudimos validar tu perfil de proveedor." };
  }

  if (profile && profile.role !== "provider") {
    return { ok: false, message: "Acceso no permitido. Esta cuenta no esta registrada como proveedor." };
  }

  if (profile) {
    return { ok: true };
  }

  const { error: insertError } = await supabase.from("user_profiles").insert({
    id: user.id,
    email: normalizedEmail,
    full_name: normalizedName,
    role: "provider",
  });

  if (insertError) {
    console.error("provider profile insert failed", {
      message: insertError.message,
      details: insertError.details,
      hint: insertError.hint,
      code: insertError.code,
      fullError: insertError,
    });
    return { ok: false, message: "No pudimos crear tu perfil de proveedor. Intenta de nuevo." };
  }

  return { ok: true };
}

export function ProviderLoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    if (mode === "login") {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError("Correo o contrasena incorrectos.");
        setLoading(false);
        return;
      }

      const authUser = signInData.user ?? signInData.session?.user ?? null;

      if (!authUser) {
        await supabase.auth.signOut();
        setError("No pudimos validar tu sesion.");
        setLoading(false);
        return;
      }

      const profileResult = await ensureProviderProfile(authUser, fullName);

      if (!profileResult.ok) {
        await supabase.auth.signOut();
        setError(profileResult.message ?? "Acceso no permitido.");
        setLoading(false);
        return;
      }

      router.replace("/proveedor/panel");
      router.refresh();
      return;
    }

    if (password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/proveedor/login`,
        data: {
          full_name: fullName.trim(),
          role: "provider",
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message.includes("already") ? "Ese correo ya esta registrado." : "No pudimos crear tu cuenta.");
      setLoading(false);
      return;
    }

    const authUser = signUpData.user ?? signUpData.session?.user ?? null;

    if (!authUser || !signUpData.session) {
      setMessage("Cuenta creada. Revisa tu correo para confirmar el acceso y despues inicia sesion.");
      setLoading(false);
      return;
    }

    const profileResult = await ensureProviderProfile(authUser, fullName);

    if (!profileResult.ok) {
      setError(profileResult.message ?? "No pudimos crear tu perfil de proveedor.");
      setLoading(false);
      return;
    }

    router.replace("/proveedor/panel");
    router.refresh();
  }

  const submitLabel = mode === "login" ? "Iniciar sesion" : "Crear cuenta";

  return (
    <Card className="w-full p-5 shadow-soft sm:p-7">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-casero-green">Proveedores</p>
        <h1 className="mt-3 font-heading text-2xl font-extrabold text-casero-dark sm:text-3xl">
          Acceso a tu cuenta
        </h1>
        <p className="mt-3 text-sm leading-6 text-casero-text/70">
          Entra o registra una cuenta para administrar tu negocio en Casero Cancun.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 rounded-md bg-casero-beige/60 p-1">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError(null);
            setMessage(null);
          }}
          className={`rounded-md px-3 py-2 text-sm font-bold transition ${
            mode === "login" ? "bg-white text-casero-dark shadow-sm" : "text-casero-text/70"
          }`}
        >
          Entrar
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setError(null);
            setMessage(null);
          }}
          className={`rounded-md px-3 py-2 text-sm font-bold transition ${
            mode === "register" ? "bg-white text-casero-dark shadow-sm" : "text-casero-text/70"
          }`}
        >
          Registro
        </button>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        {mode === "register" ? (
          <label className="text-sm font-bold text-casero-dark">
            Nombre completo
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2.5 font-normal outline-casero-green"
              type="text"
              autoComplete="name"
              required
            />
          </label>
        ) : null}

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
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
          />
        </label>

        {error ? <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
        {message ? <p className="rounded-md bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{message}</p> : null}

        <Button type="submit" variant="secondary" disabled={loading}>
          {loading ? "Procesando..." : submitLabel}
        </Button>
      </form>
    </Card>
  );
}
