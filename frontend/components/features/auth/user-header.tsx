"use client";

import { ROLE_LABELS } from "@/lib/auth/roles";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function UserHeader() {
  const { profile, loading, signOut } = useAuth();

  if (loading) {
    return <p className="ml-auto text-xs text-slate-500">Cargando sesion...</p>;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="ml-auto flex items-center gap-3">
      <div className="text-right text-xs leading-tight">
        <p className="font-medium">{profile.nombre}</p>
        <p className="text-slate-500">{profile.email}</p>
        <p className="text-slate-500">{ROLE_LABELS[profile.rol]}</p>
      </div>
      <Button className="ml-2 h-8 border border-slate-300 bg-white px-3 text-slate-700 hover:bg-slate-50" onClick={() => void signOut()} type="button">
        Cerrar sesion
      </Button>
    </div>
  );
}
