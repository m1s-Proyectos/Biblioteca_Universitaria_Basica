"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { ROLE_HOME_ROUTES } from "@/lib/auth/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RolUsuario } from "@/types/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const parsed = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password")
    });

    if (!parsed.success) {
      setLoading(false);
      setError("Credenciales invalidas.");
      return;
    }

    const supabase = createBrowserSupabaseClient();
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword(parsed.data);

    if (signInError) {
      setLoading(false);
      setError(signInError.message);
      return;
    }

    const userId = signInData.user?.id;
    if (!userId) {
      setLoading(false);
      setError("No se pudo obtener la sesion del usuario.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("id", userId)
      .single();

    setLoading(false);

    if (profileError || !profile?.rol) {
      await supabase.auth.signOut();
      setError("Tu usuario no tiene perfil en el sistema. Contacta al administrador.");
      return;
    }

    router.push(ROLE_HOME_ROUTES[profile.rol as RolUsuario]);
    router.refresh();
  }

  return (
    <form action={onSubmit} className="mt-6 space-y-4">
      <Input name="email" type="email" placeholder="correo@universidad.edu" required />
      <Input name="password" type="password" placeholder="Contrasena" required />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button className="w-full" disabled={loading} type="submit">
        {loading ? "Ingresando..." : "Ingresar"}
      </Button>
    </form>
  );
}
