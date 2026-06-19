"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { ROLE_HOME_ROUTES } from "@/lib/auth/roles";
import type { RolUsuario, UsuarioProfile } from "@/types/auth";

export function useAuth() {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  const [profile, setProfile] = useState<UsuarioProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setProfile(null);
      setLoading(false);
      return null;
    }

    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nombre, email, rol, matricula")
      .eq("id", user.id)
      .single();

    if (error || !data) {
      setProfile(null);
      setLoading(false);
      return null;
    }

    const nextProfile: UsuarioProfile = {
      id: data.id,
      nombre: data.nombre,
      email: data.email,
      rol: data.rol as RolUsuario,
      matricula: data.matricula
    };
    setProfile(nextProfile);
    setLoading(false);
    return nextProfile;
  }, [supabase]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
    router.push("/login");
    router.refresh();
  }

  function redirectHomeForRole(rol: RolUsuario) {
    router.push(ROLE_HOME_ROUTES[rol]);
    router.refresh();
  }

  return {
    profile,
    loading,
    loadProfile,
    signOut,
    redirectHomeForRole
  };
}

export function useAuthClient() {
  return createBrowserSupabaseClient();
}
