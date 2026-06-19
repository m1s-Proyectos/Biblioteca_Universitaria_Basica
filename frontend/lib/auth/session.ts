import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { RolUsuario, UsuarioProfile } from "@/types/auth";

export async function getServerUserProfile(): Promise<UsuarioProfile | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("usuarios")
    .select("id, nombre, email, rol, matricula")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    nombre: data.nombre,
    email: data.email,
    rol: data.rol as RolUsuario,
    matricula: data.matricula
  };
}
