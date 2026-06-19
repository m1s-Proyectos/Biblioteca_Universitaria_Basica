import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { canAccessRoute, ROLE_HOME_ROUTES } from "@/lib/auth/roles";
import type { RolUsuario } from "@/types/auth";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/admin",
  "/biblioteca",
  "/catalogo",
  "/libros",
  "/prestamos",
  "/multas",
  "/reportes"
];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  type CookieToSet = {
    name: string;
    value: string;
    options?: Parameters<typeof response.cookies.set>[2];
  };

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        }
      }
    }
  );

  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isProtectedRoute) {
    const { data: profile } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("id", user.id)
      .single();

    if (!profile?.rol) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "sin-perfil");
      await supabase.auth.signOut();
      return NextResponse.redirect(url);
    }

    const rol = profile.rol as RolUsuario;

    if (!canAccessRoute(rol, pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = ROLE_HOME_ROUTES[rol];
      return NextResponse.redirect(url);
    }
  }

  if (user && pathname === "/login") {
    const { data: profile } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("id", user.id)
      .single();

    if (profile?.rol) {
      const url = request.nextUrl.clone();
      url.pathname = ROLE_HOME_ROUTES[profile.rol as RolUsuario];
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/admin/:path*",
    "/biblioteca/:path*",
    "/catalogo/:path*",
    "/libros/:path*",
    "/prestamos/:path*",
    "/multas/:path*",
    "/reportes/:path*"
  ]
};
