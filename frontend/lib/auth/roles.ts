import type { RolUsuario } from "@/types/auth";

export const ROLE_HOME_ROUTES: Record<RolUsuario, string> = {
  admin: "/admin",
  bibliotecario: "/biblioteca",
  estudiante: "/catalogo"
};

export const ROLE_ROUTE_ACCESS: Record<RolUsuario, string[]> = {
  admin: ["/admin", "/reportes", "/dashboard", "/libros", "/prestamos", "/multas"],
  bibliotecario: ["/biblioteca", "/libros", "/prestamos", "/multas", "/dashboard"],
  estudiante: ["/catalogo", "/prestamos", "/multas", "/dashboard"]
};

export const ROLE_LABELS: Record<RolUsuario, string> = {
  admin: "Administrador",
  bibliotecario: "Bibliotecario",
  estudiante: "Estudiante"
};

export function canAccessRoute(rol: RolUsuario, pathname: string): boolean {
  const allowed = ROLE_ROUTE_ACCESS[rol];
  return allowed.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function getNavLinksForRole(rol: RolUsuario): { href: string; label: string }[] {
  switch (rol) {
    case "admin":
      return [
        { href: "/admin", label: "Admin" },
        { href: "/libros", label: "Libros" },
        { href: "/reportes", label: "Reportes" },
        { href: "/dashboard", label: "Dashboard" }
      ];
    case "bibliotecario":
      return [
        { href: "/biblioteca", label: "Biblioteca" },
        { href: "/libros", label: "Libros" },
        { href: "/prestamos", label: "Prestamos" },
        { href: "/multas", label: "Multas" }
      ];
    case "estudiante":
      return [
        { href: "/catalogo", label: "Catalogo" },
        { href: "/prestamos", label: "Mis prestamos" },
        { href: "/multas", label: "Mis multas" }
      ];
    default:
      return [];
  }
}
