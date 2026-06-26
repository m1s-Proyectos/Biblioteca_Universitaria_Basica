const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiFetchOptions = RequestInit & {
  auth?: boolean;
};

async function getAccessToken(): Promise<string | null> {
  const { createBrowserSupabaseClient } = await import("@/lib/supabase/client");
  const supabase = createBrowserSupabaseClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (session?.access_token) {
    return session.access_token;
  }

  const { data: refreshed } = await supabase.auth.refreshSession();
  return refreshed.session?.access_token ?? null;
}

async function handleUnauthorized(): Promise<never> {
  const { createBrowserSupabaseClient } = await import("@/lib/supabase/client");
  const supabase = createBrowserSupabaseClient();
  await supabase.auth.signOut();

  if (typeof window !== "undefined") {
    window.location.href = "/login?error=sesion-expirada";
  }

  throw new ApiError("Sesion expirada", 401);
}

export async function apiFetch<T>(path: string, init?: ApiFetchOptions): Promise<T> {
  const { auth = true, ...requestInit } = init ?? {};
  const headers = new Headers(requestInit.headers);
  headers.set("Content-Type", "application/json");

  if (auth) {
    const token = await getAccessToken();
    if (!token) {
      return handleUnauthorized();
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...requestInit,
    headers
  });

  if (response.status === 401 && auth) {
    const { createBrowserSupabaseClient } = await import("@/lib/supabase/client");
    const supabase = createBrowserSupabaseClient();
    const { data: refreshed } = await supabase.auth.refreshSession();
    const retryToken = refreshed.session?.access_token;

    if (retryToken) {
      headers.set("Authorization", `Bearer ${retryToken}`);
      const retryResponse = await fetch(`${API_URL}${path}`, {
        ...requestInit,
        headers
      });

      if (retryResponse.ok) {
        return retryResponse.json() as Promise<T>;
      }

      if (retryResponse.status !== 401) {
        let message = `API error: ${retryResponse.status}`;
        try {
          const problem = (await retryResponse.json()) as { detail?: string; title?: string };
          if (problem.detail) message = problem.detail;
          else if (problem.title) message = problem.title;
        } catch {
          // respuesta no JSON
        }
        throw new ApiError(message, retryResponse.status);
      }
    }

    return handleUnauthorized();
  }

  if (response.status === 401) {
    return handleUnauthorized();
  }

  if (response.status === 403) {
    throw new ApiError("No tienes permisos para realizar esta accion", 403);
  }

  if (!response.ok) {
    let message = `API error: ${response.status}`;
    try {
      const problem = (await response.json()) as { detail?: string; title?: string };
      if (problem.detail) {
        message = problem.detail;
      } else if (problem.title) {
        message = problem.title;
      }
    } catch {
      // respuesta no JSON
    }
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}
