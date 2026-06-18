import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 text-sm">
          <Link className="font-semibold" href="/dashboard">
            SGBU
          </Link>
          <Link href="/libros">Libros</Link>
          <Link href="/prestamos">Prestamos</Link>
          <Link href="/multas">Multas</Link>
          <Link href="/reportes">Reportes</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}

