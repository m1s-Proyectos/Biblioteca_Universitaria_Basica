"use client";

import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { libroFormSchema, type LibroFormSchema } from "@/lib/validations/libro-schema";
import type { Libro, LibroReferencias } from "@/types/libros";
import { cn } from "@/lib/utils";

type LibroFormModalProps = {
  open: boolean;
  title: string;
  libro?: Libro | null;
  referencias?: LibroReferencias;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (values: LibroFormSchema) => Promise<void>;
};

const selectClassName =
  "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-offset-white focus-visible:ring-2 focus-visible:ring-primary";

export function LibroFormModal({
  open,
  title,
  libro,
  referencias,
  loading,
  error,
  onClose,
  onSubmit
}: LibroFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<LibroFormSchema>({
    resolver: zodResolver(libroFormSchema),
    defaultValues: {
      isbn: "",
      titulo: "",
      subtitulo: "",
      descripcion: "",
      idioma: "es",
      autorId: "",
      categoriaId: "",
      editorialId: "",
      portadaUrl: ""
    }
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    if (libro) {
      reset({
        isbn: libro.isbn,
        titulo: libro.titulo,
        subtitulo: libro.subtitulo ?? "",
        descripcion: libro.descripcion ?? "",
        anioPublicacion: libro.anioPublicacion ?? undefined,
        idioma: libro.idioma,
        numeroPaginas: libro.numeroPaginas ?? undefined,
        portadaUrl: libro.portadaUrl ?? "",
        autorId: libro.autor.id,
        categoriaId: libro.categoria.id,
        editorialId: libro.editorial.id
      });
    } else {
      reset({
        isbn: "",
        titulo: "",
        subtitulo: "",
        descripcion: "",
        idioma: "es",
        autorId: "",
        categoriaId: "",
        editorialId: "",
        portadaUrl: ""
      });
    }
  }, [open, libro, reset]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button className="text-sm text-slate-500 hover:text-slate-800" onClick={onClose} type="button">
            Cerrar
          </button>
        </div>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            await onSubmit(values);
          })}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="ISBN" error={errors.isbn?.message}>
              <Input {...register("isbn")} placeholder="978-..." />
            </Field>
            <Field label="Titulo" error={errors.titulo?.message}>
              <Input {...register("titulo")} placeholder="Titulo del libro" />
            </Field>
            <Field label="Subtitulo" error={errors.subtitulo?.message}>
              <Input {...register("subtitulo")} />
            </Field>
            <Field label="Idioma" error={errors.idioma?.message}>
              <Input {...register("idioma")} placeholder="es" />
            </Field>
            <Field label="Anio" error={errors.anioPublicacion?.message}>
              <Input type="number" {...register("anioPublicacion")} />
            </Field>
            <Field label="Paginas" error={errors.numeroPaginas?.message}>
              <Input type="number" {...register("numeroPaginas")} />
            </Field>
            <Field label="Autor" error={errors.autorId?.message}>
              <select className={selectClassName} {...register("autorId")}>
                <option value="">Seleccionar autor</option>
                {referencias?.autores.map((autor) => (
                  <option key={autor.id} value={autor.id}>
                    {autor.nombreCompleto}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Categoria" error={errors.categoriaId?.message}>
              <select className={selectClassName} {...register("categoriaId")}>
                <option value="">Seleccionar categoria</option>
                {referencias?.categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Editorial" error={errors.editorialId?.message}>
              <select className={selectClassName} {...register("editorialId")}>
                <option value="">Seleccionar editorial</option>
                {referencias?.editoriales.map((editorial) => (
                  <option key={editorial.id} value={editorial.id}>
                    {editorial.nombre}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="URL portada" error={errors.portadaUrl?.message}>
              <Input {...register("portadaUrl")} placeholder="https://..." />
            </Field>
          </div>

          <Field label="Descripcion" error={errors.descripcion?.message}>
            <textarea
              className={cn(selectClassName, "min-h-24 py-2")}
              {...register("descripcion")}
            />
          </Field>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex justify-end gap-2">
            <Button className="bg-slate-200 text-slate-900 hover:opacity-100" onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button disabled={loading || isSubmitting} type="submit">
              {loading || isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      {children}
      {error ? <span className="block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
