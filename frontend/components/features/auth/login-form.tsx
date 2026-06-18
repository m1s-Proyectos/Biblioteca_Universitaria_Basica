"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    const { error: signInError } = await supabase.auth.signInWithPassword(parsed.data);

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/dashboard");
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

