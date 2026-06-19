import Link from "next/link";
import { getNavLinksForRole } from "@/lib/auth/roles";
import type { RolUsuario } from "@/types/auth";

type DashboardNavProps = {
  rol: RolUsuario;
};

export function DashboardNav({ rol }: DashboardNavProps) {
  const links = getNavLinksForRole(rol);

  return (
    <nav className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 text-sm">
      <Link className="font-semibold" href={links[0]?.href ?? "/dashboard"}>
        SGBU
      </Link>
      {links.map((link) => (
        <Link key={link.href} href={link.href}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
