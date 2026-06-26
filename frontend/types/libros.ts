export type AutorSummary = {
  id: string;
  nombre: string;
  apellido: string;
  nombreCompleto: string;
};

export type CategoriaSummary = {
  id: string;
  nombre: string;
};

export type EditorialSummary = {
  id: string;
  nombre: string;
};

export type Libro = {
  id: string;
  isbn: string;
  titulo: string;
  subtitulo: string | null;
  descripcion: string | null;
  anioPublicacion: number | null;
  idioma: string;
  numeroPaginas: number | null;
  portadaUrl: string | null;
  autor: AutorSummary;
  categoria: CategoriaSummary;
  editorial: EditorialSummary;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export type LibroFilters = {
  q?: string;
  isbn?: string;
  titulo?: string;
  autor?: string;
  editorial?: string;
  categoria?: string;
  categoriaId?: string;
  idioma?: string;
  anio?: number;
  activo?: boolean;
  page?: number;
  size?: number;
  sort?: string;
};

export type LibroFormValues = {
  isbn: string;
  titulo: string;
  subtitulo?: string;
  descripcion?: string;
  anioPublicacion?: number;
  idioma: string;
  numeroPaginas?: number;
  portadaUrl?: string;
  autorId: string;
  categoriaId: string;
  editorialId: string;
};

export type LibroReferencias = {
  autores: AutorSummary[];
  categorias: CategoriaSummary[];
  editoriales: EditorialSummary[];
};
