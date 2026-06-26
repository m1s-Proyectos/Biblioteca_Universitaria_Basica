"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLibro,
  deleteLibro,
  fetchLibroById,
  fetchLibroReferencias,
  fetchLibros,
  updateLibro
} from "@/lib/api/libros";
import type { LibroFilters, LibroFormValues } from "@/types/libros";

export function useLibros(filters: LibroFilters) {
  return useQuery({
    queryKey: ["libros", filters],
    queryFn: () => fetchLibros(filters)
  });
}

export function useLibro(id: string | null) {
  return useQuery({
    queryKey: ["libro", id],
    queryFn: () => fetchLibroById(id!),
    enabled: Boolean(id)
  });
}

export function useLibroReferencias() {
  return useQuery({
    queryKey: ["libro-referencias"],
    queryFn: fetchLibroReferencias
  });
}

export function useCreateLibro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LibroFormValues) => createLibro(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["libros"] });
    }
  });
}

export function useUpdateLibro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: LibroFormValues }) =>
      updateLibro(id, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["libros"] });
      void queryClient.invalidateQueries({ queryKey: ["libro", variables.id] });
    }
  });
}

export function useDeleteLibro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLibro(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["libros"] });
    }
  });
}
