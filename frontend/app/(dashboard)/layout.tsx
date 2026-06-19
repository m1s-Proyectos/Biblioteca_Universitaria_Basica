import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/features/auth/dashboard-nav";
import { UserHeader } from "@/components/features/auth/user-header";
import { getServerUserProfile } from "@/lib/auth/session";
import { ROLE_HOME_ROUTES } from "@/lib/auth/roles";

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getServerUserProfile();

  if (!profile) {
    redirect("/login?error=sin-perfil");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-3">
          <DashboardNav rol={profile.rol} />
          <UserHeader />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
