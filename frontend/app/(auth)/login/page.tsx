import { LoginForm } from "@/components/features/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <section className="w-full max-w-sm rounded-lg border p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">SGBU Web</h1>
        <p className="mt-2 text-sm text-slate-600">Ingreso al sistema de biblioteca universitaria.</p>
        <LoginForm />
      </section>
    </main>
  );
}

