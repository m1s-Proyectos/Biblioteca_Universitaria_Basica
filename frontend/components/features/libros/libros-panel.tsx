"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LibroFormModal } from "@/components/features/libros/libro-form-modal";
import {
  useCreateLibro,
  useDeleteLibro,
  useLibro,
  useLibroReferencias,
  useLibros,
  useUpdateLibro
} from "@/hooks/use-libros";
import { ApiError } from "@/lib/api/client";
import type { LibroFormSchema } from "@/lib/validations/libro-schema";
import type { Libro, LibroFilters } from "@/types/libros";

type LibrosPanelProps = {
  mode: "manage" | "readonly";
  title: string;
  description?: string;
  defaultFilters?: Partial<LibroFilters>;
};

export function LibrosPanel({ mode, title, description, defaultFilters }: LibrosPanelProps) {
  const canManage = mode === "manage";
  const [page, setPage] = useState(0);
  const [q, setQ] = useState("");
  const [isbn, setIsbn] = useState("");
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [editorial, setEditorial] = useState("");
  const [idioma, setIdioma] = useState("");
  const [anio, setAnio] = useState("");
  const [activoFilter, setActivoFilter] = useState<string>(
    defaultFilters?.activo === false ? "false" : defaultFilters?.activo === true ? "true" : "all"
  );
  const [appliedFilters, setAppliedFilters] = useState<LibroFilters>({
    ...defaultFilters,
    page: 0,
    size: 10,
    sort: "titulo,asc"
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editingLibro, setEditingLibro] = useState<Libro | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Libro | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filters = useMemo<LibroFilters>(
    () => ({
      ...appliedFilters,
      page
    }),
    [appliedFilters, page]
  );

  const { data, isLoading, isError, error, refetch } = useLibros(filters);
  const { data: referencias } = useLibroReferencias();
  const { data: detailLibro } = useLibro(detailId);
  const createMutation = useCreateLibro();
  const updateMutation = useUpdateLibro();
  const deleteMutation = useDeleteLibro();

  function applyFilters() {
    setPage(0);
    setAppliedFilters({
      ...defaultFilters,
      q: q || undefined,
      isbn: isbn || undefined,
      titulo: titulo || undefined,
      autor: autor || undefined,
      editorial: editorial || undefined,
      idioma: idioma || undefined,
      anio: anio ? Number(anio) : undefined,
      activo: activoFilter === "all" ? undefined : activoFilter === "true",
      page: 0,
      size: 10,
      sort: "titulo,asc"
    });
  }

  function clearFilters() {
    setQ("");
    setIsbn("");
    setTitulo("");
    setAutor("");
    setEditorial("");
    setIdioma("");
    setAnio("");
    setActivoFilter(defaultFilters?.activo === true ? "true" : "all");
    setPage(0);
    setAppliedFilters({
      ...defaultFilters,
      page: 0,
      size: 10,
      sort: "titulo,asc"
    });
  }

  function openCreate() {
    setEditingLibro(null);
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(libro: Libro) {
    setEditingLibro(libro);
    setFormError(null);
    setFormOpen(true);
  }

  async function handleSubmit(values: LibroFormSchema) {
    setFormError(null);
    const payload = {
      ...values,
      subtitulo: values.subtitulo || undefined,
      descripcion: values.descripcion || undefined,
      portadaUrl: values.portadaUrl || undefined
    };

    try {
      if (editingLibro) {
        await updateMutation.mutateAsync({ id: editingLibro.id, payload });
        setSuccessMessage("Libro actualizado correctamente");
      } else {
        await createMutation.mutateAsync(payload);
        setSuccessMessage("Libro creado correctamente");
      }
      setFormOpen(false);
      setEditingLibro(null);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "No se pudo guardar el libro");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setSuccessMessage("Libro desactivado correctamente");
      setDeleteTarget(null);
    } catch (err) {
      setSuccessMessage(null);
      setFormError(err instanceof ApiError ? err.message : "No se pudo desactivar el libro");
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
        </div>
        {canManage ? (
          <Button onClick={openCreate}>Nuevo libro</Button>
        ) : null}
      </div>

      {successMessage ? (
        <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          {successMessage}
        </p>
      ) : null}

      <div className="rounded-lg border bg-white p-4">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Input placeholder="Buscar..." value={q} onChange={(e) => setQ(e.target.value)} />
          <Input placeholder="ISBN" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
          <Input placeholder="Titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          <Input placeholder="Autor" value={autor} onChange={(e) => setAutor(e.target.value)} />
          <Input placeholder="Editorial" value={editorial} onChange={(e) => setEditorial(e.target.value)} />
          <Input placeholder="Idioma" value={idioma} onChange={(e) => setIdioma(e.target.value)} />
          <Input placeholder="Anio" type="number" value={anio} onChange={(e) => setAnio(e.target.value)} />
          {canManage ? (
            <select
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              value={activoFilter}
              onChange={(e) => setActivoFilter(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          ) : null}
        </div>
        <div className="mt-3 flex gap-2">
          <Button onClick={applyFilters}>Buscar</Button>
          <Button className="bg-slate-200 text-slate-900 hover:opacity-100" onClick={clearFilters}>
            Limpiar
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        {isLoading ? (
          <p className="p-6 text-sm text-slate-600">Cargando libros...</p>
        ) : isError ? (
          <div className="space-y-2 p-6">
            <p className="text-sm text-red-600">
              {error instanceof ApiError ? error.message : "Error al cargar libros"}
            </p>
            <Button onClick={() => void refetch()}>Reintentar</Button>
          </div>
        ) : !data || data.content.length === 0 ? (
          <p className="p-6 text-sm text-slate-600">No se encontraron libros.</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">ISBN</th>
                <th className="px-4 py-3 font-medium">Titulo</th>
                <th className="px-4 py-3 font-medium">Autor</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Editorial</th>
                <th className="px-4 py-3 font-medium">Anio</th>
                {canManage ? <th className="px-4 py-3 font-medium">Estado</th> : null}
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.content.map((libro) => (
                <tr key={libro.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3">{libro.isbn}</td>
                  <td className="px-4 py-3">{libro.titulo}</td>
                  <td className="px-4 py-3">{libro.autor.nombreCompleto}</td>
                  <td className="px-4 py-3">{libro.categoria.nombre}</td>
                  <td className="px-4 py-3">{libro.editorial.nombre}</td>
                  <td className="px-4 py-3">{libro.anioPublicacion ?? "—"}</td>
                  {canManage ? (
                    <td className="px-4 py-3">
                      <span
                        className={
                          libro.activo
                            ? "rounded-full bg-green-100 px-2 py-1 text-xs text-green-800"
                            : "rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600"
                        }
                      >
                        {libro.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                  ) : null}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="text-primary hover:underline"
                        onClick={() => setDetailId(libro.id)}
                        type="button"
                      >
                        Ver
                      </button>
                      {canManage && libro.activo ? (
                        <>
                          <button
                            className="text-primary hover:underline"
                            onClick={() => openEdit(libro)}
                            type="button"
                          >
                            Editar
                          </button>
                          <button
                            className="text-red-600 hover:underline"
                            onClick={() => setDeleteTarget(libro)}
                            type="button"
                          >
                            Desactivar
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {data && data.totalPages > 1 ? (
        <div className="flex items-center justify-between text-sm">
          <p className="text-slate-600">
            Pagina {data.page + 1} de {data.totalPages} ({data.totalElements} libros)
          </p>
          <div className="flex gap-2">
            <Button disabled={data.page <= 0} onClick={() => setPage((p) => p - 1)}>
              Anterior
            </Button>
            <Button disabled={data.last} onClick={() => setPage((p) => p + 1)}>
              Siguiente
            </Button>
          </div>
        </div>
      ) : null}

      <LibroFormModal
        open={formOpen}
        title={editingLibro ? "Editar libro" : "Nuevo libro"}
        libro={editingLibro}
        referencias={referencias}
        loading={createMutation.isPending || updateMutation.isPending}
        error={formError}
        onClose={() => {
          setFormOpen(false);
          setEditingLibro(null);
          setFormError(null);
        }}
        onSubmit={handleSubmit}
      />

      {detailId && detailLibro ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Detalle del libro</h2>
              <button
                className="text-sm text-slate-500 hover:text-slate-800"
                onClick={() => setDetailId(null)}
                type="button"
              >
                Cerrar
              </button>
            </div>
            <dl className="space-y-2 text-sm">
              <DetailRow label="ISBN" value={detailLibro.isbn} />
              <DetailRow label="Titulo" value={detailLibro.titulo} />
              {detailLibro.subtitulo ? <DetailRow label="Subtitulo" value={detailLibro.subtitulo} /> : null}
              <DetailRow label="Autor" value={detailLibro.autor.nombreCompleto} />
              <DetailRow label="Categoria" value={detailLibro.categoria.nombre} />
              <DetailRow label="Editorial" value={detailLibro.editorial.nombre} />
              <DetailRow label="Anio" value={String(detailLibro.anioPublicacion ?? "—")} />
              <DetailRow label="Idioma" value={detailLibro.idioma} />
              <DetailRow label="Paginas" value={String(detailLibro.numeroPaginas ?? "—")} />
              {detailLibro.descripcion ? (
                <DetailRow label="Descripcion" value={detailLibro.descripcion} />
              ) : null}
              {canManage ? (
                <DetailRow label="Estado" value={detailLibro.activo ? "Activo" : "Inactivo"} />
              ) : null}
            </dl>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Desactivar libro</h2>
            <p className="mt-2 text-sm text-slate-600">
              ¿Desactivar &quot;{deleteTarget.titulo}&quot;? El registro permanecera en el sistema pero no estara
              visible en el catalogo publico.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button className="bg-slate-200 text-slate-900 hover:opacity-100" onClick={() => setDeleteTarget(null)}>
                Cancelar
              </Button>
              <Button disabled={deleteMutation.isPending} onClick={() => void confirmDelete()}>
                {deleteMutation.isPending ? "Desactivando..." : "Confirmar"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium text-slate-700">{label}</dt>
      <dd className="text-slate-600">{value}</dd>
    </div>
  );
}
