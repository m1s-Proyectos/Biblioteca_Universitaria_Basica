-- Fase 2: catalogo bibliografico (autores, categorias, editoriales, libros)
-- Preparado para Fase 3 (ejemplares.libro_id) y Fase 6 (reservas.libro_id)

CREATE TABLE public.autores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  nacionalidad TEXT,
  fecha_nacimiento DATE,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT autores_nombre_apellido_unique UNIQUE (nombre, apellido)
);

CREATE TABLE public.categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.editoriales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  pais TEXT,
  sitio_web TEXT,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT editoriales_sitio_web_format CHECK (
    sitio_web IS NULL OR sitio_web ~* '^https?://'
  )
);

CREATE TABLE public.libros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  isbn VARCHAR(17) NOT NULL,
  titulo TEXT NOT NULL,
  subtitulo TEXT,
  descripcion TEXT,
  anio_publicacion SMALLINT,
  idioma VARCHAR(10) NOT NULL DEFAULT 'es',
  numero_paginas INTEGER,
  portada_url TEXT,
  autor_id UUID NOT NULL REFERENCES public.autores (id),
  categoria_id UUID NOT NULL REFERENCES public.categorias (id),
  editorial_id UUID NOT NULL REFERENCES public.editoriales (id),
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT libros_isbn_unique UNIQUE (isbn),
  CONSTRAINT libros_titulo_not_blank CHECK (char_length(trim(titulo)) > 0),
  CONSTRAINT libros_anio_valido CHECK (
    anio_publicacion IS NULL OR (anio_publicacion >= 1000 AND anio_publicacion <= 2100)
  ),
  CONSTRAINT libros_paginas_positivas CHECK (
    numero_paginas IS NULL OR numero_paginas > 0
  ),
  CONSTRAINT libros_portada_url_format CHECK (
    portada_url IS NULL OR portada_url ~* '^https?://'
  )
);

CREATE INDEX idx_autores_activo ON public.autores (activo);
CREATE INDEX idx_autores_apellido ON public.autores (apellido);

CREATE INDEX idx_categorias_activo ON public.categorias (activo);

CREATE INDEX idx_editoriales_activo ON public.editoriales (activo);

CREATE INDEX idx_libros_activo ON public.libros (activo);
CREATE INDEX idx_libros_isbn ON public.libros (isbn);
CREATE INDEX idx_libros_titulo ON public.libros (titulo);
CREATE INDEX idx_libros_autor_id ON public.libros (autor_id);
CREATE INDEX idx_libros_categoria_id ON public.libros (categoria_id);
CREATE INDEX idx_libros_editorial_id ON public.libros (editorial_id);
CREATE INDEX idx_libros_anio_publicacion ON public.libros (anio_publicacion);
CREATE INDEX idx_libros_idioma ON public.libros (idioma);

CREATE TRIGGER trg_autores_updated_at
BEFORE UPDATE ON public.autores
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_categorias_updated_at
BEFORE UPDATE ON public.categorias
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_editoriales_updated_at
BEFORE UPDATE ON public.editoriales
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_libros_updated_at
BEFORE UPDATE ON public.libros
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.autores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editoriales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.libros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "catalogo_select_authenticated"
ON public.autores FOR SELECT TO authenticated USING (true);

CREATE POLICY "catalogo_select_authenticated"
ON public.categorias FOR SELECT TO authenticated USING (true);

CREATE POLICY "catalogo_select_authenticated"
ON public.editoriales FOR SELECT TO authenticated USING (true);

CREATE POLICY "catalogo_select_authenticated"
ON public.libros FOR SELECT TO authenticated USING (true);

GRANT SELECT ON public.autores, public.categorias, public.editoriales, public.libros TO authenticated;
GRANT ALL ON public.autores, public.categorias, public.editoriales, public.libros TO service_role;
