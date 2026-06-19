-- Fase 1: perfil de usuario vinculado a Supabase Auth
-- Decision: trigger PostgreSQL (mas robusto que Edge Function para sync en INSERT)
-- - Ejecuta en la misma transaccion que auth.users
-- - Sin dependencia de red ni cold start
-- - SECURITY DEFINER garantiza permisos sobre public.usuarios

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE public.rol_usuario AS ENUM (
  'admin',
  'bibliotecario',
  'estudiante'
);

CREATE TABLE public.usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  rol public.rol_usuario NOT NULL DEFAULT 'estudiante',
  matricula TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT usuarios_rol_not_null CHECK (rol IS NOT NULL)
);

CREATE INDEX idx_usuarios_email ON public.usuarios (email);
CREATE INDEX idx_usuarios_rol ON public.usuarios (rol);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_usuarios_updated_at
BEFORE UPDATE ON public.usuarios
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_nombre TEXT;
  v_rol public.rol_usuario;
  v_matricula TEXT;
BEGIN
  v_nombre := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data ->> 'nombre'), ''),
    split_part(NEW.email, '@', 1)
  );

  v_matricula := NULLIF(TRIM(NEW.raw_user_meta_data ->> 'matricula'), '');

  BEGIN
    v_rol := COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data ->> 'rol'), '')::public.rol_usuario,
      'estudiante'::public.rol_usuario
    );
  EXCEPTION
    WHEN invalid_text_representation THEN
      v_rol := 'estudiante'::public.rol_usuario;
  END;

  INSERT INTO public.usuarios (id, nombre, email, rol, matricula)
  VALUES (NEW.id, v_nombre, NEW.email, v_rol, v_matricula)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_auth_user();

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuarios_select_own"
ON public.usuarios
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "usuarios_update_own"
ON public.usuarios
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

GRANT SELECT, UPDATE ON public.usuarios TO authenticated;
GRANT ALL ON public.usuarios TO service_role;
