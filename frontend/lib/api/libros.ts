import { apiFetch } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type {
  AutorSummary,
  CategoriaSummary,
  EditorialSummary,
  Libro,
  LibroFilters,
  LibroFormValues,
  LibroReferencias,
  PageResponse
} from "@/types/libros";

function buildQuery(filters: LibroFilters): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.isbn) params.set("isbn", filters.isbn);
  if (filters.titulo) params.set("titulo", filters.titulo);
  if (filters.autor) params.set("autor", filters.autor);
  if (filters.editorial) params.set("editorial", filters.editorial);
  if (filters.categoria) params.set("categoria", filters.categoria);
  if (filters.categoriaId) params.set("categoriaId", filters.categoriaId);
  if (filters.idioma) params.set("idioma", filters.idioma);
  if (filters.anio != null) params.set("anio", String(filters.anio));
  if (filters.activo != null) params.set("activo", String(filters.activo));
  params.set("page", String(filters.page ?? 0));
  params.set("size", String(filters.size ?? 10));
  params.set("sort", filters.sort ?? "titulo,asc");
  return params.toString();
}

export async function fetchLibros(filters: LibroFilters) {
  const response = await apiFetch<ApiResponse<PageResponse<Libro>>>(
    `/api/v1/libros?${buildQuery(filters)}`
  );
  return response.data;
}

export async function fetchLibroById(id: string) {
  const response = await apiFetch<ApiResponse<Libro>>(`/api/v1/libros/${id}`);
  return response.data;
}

export async function createLibro(payload: LibroFormValues) {
  const response = await apiFetch<ApiResponse<Libro>>("/api/v1/libros", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return response.data;
}

export async function updateLibro(id: string, payload: LibroFormValues) {
  const response = await apiFetch<ApiResponse<Libro>>(`/api/v1/libros/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
  return response.data;
}

export async function deleteLibro(id: string) {
  const response = await apiFetch<ApiResponse<Libro>>(`/api/v1/libros/${id}`, {
    method: "DELETE"
  });
  return response.data;
}

export async function fetchLibroReferencias(): Promise<LibroReferencias> {
  const [autoresRes, categoriasRes, editorialesRes] = await Promise.all([
    apiFetch<ApiResponse<AutorSummary[]>>("/api/v1/libros/referencias/autores"),
    apiFetch<ApiResponse<CategoriaSummary[]>>("/api/v1/libros/referencias/categorias"),
    apiFetch<ApiResponse<EditorialSummary[]>>("/api/v1/libros/referencias/editoriales")
  ]);

  return {
    autores: autoresRes.data,
    categorias: categoriasRes.data,
    editoriales: editorialesRes.data
  };
}
