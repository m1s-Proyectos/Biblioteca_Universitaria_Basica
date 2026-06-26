export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      autores: {
        Row: {
          id: string;
          nombre: string;
          apellido: string;
          nacionalidad: string | null;
          fecha_nacimiento: string | null;
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          apellido: string;
          nacionalidad?: string | null;
          fecha_nacimiento?: string | null;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          apellido?: string;
          nacionalidad?: string | null;
          fecha_nacimiento?: string | null;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categorias: {
        Row: {
          id: string;
          nombre: string;
          descripcion: string | null;
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          descripcion?: string | null;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          descripcion?: string | null;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      editoriales: {
        Row: {
          id: string;
          nombre: string;
          pais: string | null;
          sitio_web: string | null;
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          pais?: string | null;
          sitio_web?: string | null;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          pais?: string | null;
          sitio_web?: string | null;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      libros: {
        Row: {
          id: string;
          isbn: string;
          titulo: string;
          subtitulo: string | null;
          descripcion: string | null;
          anio_publicacion: number | null;
          idioma: string;
          numero_paginas: number | null;
          portada_url: string | null;
          autor_id: string;
          categoria_id: string;
          editorial_id: string;
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          isbn: string;
          titulo: string;
          subtitulo?: string | null;
          descripcion?: string | null;
          anio_publicacion?: number | null;
          idioma?: string;
          numero_paginas?: number | null;
          portada_url?: string | null;
          autor_id: string;
          categoria_id: string;
          editorial_id: string;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          isbn?: string;
          titulo?: string;
          subtitulo?: string | null;
          descripcion?: string | null;
          anio_publicacion?: number | null;
          idioma?: string;
          numero_paginas?: number | null;
          portada_url?: string | null;
          autor_id?: string;
          categoria_id?: string;
          editorial_id?: string;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "libros_autor_id_fkey";
            columns: ["autor_id"];
            referencedRelation: "autores";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "libros_categoria_id_fkey";
            columns: ["categoria_id"];
            referencedRelation: "categorias";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "libros_editorial_id_fkey";
            columns: ["editorial_id"];
            referencedRelation: "editoriales";
            referencedColumns: ["id"];
          }
        ];
      };
      usuarios: {
        Row: {
          id: string;
          nombre: string;
          email: string;
          rol: "admin" | "bibliotecario" | "estudiante";
          matricula: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nombre: string;
          email: string;
          rol?: "admin" | "bibliotecario" | "estudiante";
          matricula?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          email?: string;
          rol?: "admin" | "bibliotecario" | "estudiante";
          matricula?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      rol_usuario: "admin" | "bibliotecario" | "estudiante";
    };
  };
};
