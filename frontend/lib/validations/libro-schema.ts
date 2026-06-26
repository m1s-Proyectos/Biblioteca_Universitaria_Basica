import { z } from "zod";

const optionalInt = (min: number, max: number, label: string) =>
  z.preprocess(
    (value) => (value === "" || value === null || value === undefined ? undefined : Number(value)),
    z.number({ invalid_type_error: `${label} invalido` }).int().min(min).max(max).optional()
  );

const optionalPositiveInt = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? undefined : Number(value)),
  z.number({ invalid_type_error: "Debe ser un numero" }).int().min(1, "Debe ser positivo").optional()
);

export const libroFormSchema = z.object({
  isbn: z
    .string()
    .min(1, "El ISBN es obligatorio")
    .max(17, "El ISBN no puede superar 17 caracteres")
    .regex(/^[0-9Xx\-]+$/, "El ISBN solo puede contener digitos, X o guiones"),
  titulo: z.string().min(1, "El titulo es obligatorio").max(500, "Maximo 500 caracteres"),
  subtitulo: z.string().max(500, "Maximo 500 caracteres").optional().or(z.literal("")),
  descripcion: z.string().max(5000, "Maximo 5000 caracteres").optional().or(z.literal("")),
  anioPublicacion: optionalInt(1000, 2100, "Anio"),
  idioma: z.string().min(1, "El idioma es obligatorio").max(10, "Maximo 10 caracteres"),
  numeroPaginas: optionalPositiveInt,
  portadaUrl: z
    .string()
    .max(2048, "URL demasiado larga")
    .regex(/^(https?:\/\/.*)?$/, "Debe comenzar con http:// o https://")
    .optional()
    .or(z.literal("")),
  autorId: z.string().uuid("Seleccione un autor"),
  categoriaId: z.string().uuid("Seleccione una categoria"),
  editorialId: z.string().uuid("Seleccione una editorial")
});

export type LibroFormSchema = z.infer<typeof libroFormSchema>;
