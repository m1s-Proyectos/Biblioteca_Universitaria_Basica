# Sistema de Gestion de Biblioteca Universitaria - Web

Proyecto base del Sistema de Gestion de Biblioteca Universitaria (SGBU) en version web.

> **Guia del equipo:** lee el plan completo en [`docs/SGBU-Plan-de-Implementacion.pdf`](docs/SGBU-Plan-de-Implementacion.pdf).  
> Ahi encontraras las fases del proyecto, arquitectura, flujo de trabajo Git, usuarios de prueba y el estado actual (**Fase 2 completada**).

El repositorio contiene el SGBU en desarrollo progresivo por fases. Los modulos de ejemplares, prestamos, multas, reservas, reportes y administracion avanzada se implementaran en fases posteriores.

## Stack Tecnologico

### Frontend

- Next.js 15 con App Router
- React 19
- TypeScript
- Tailwind CSS
- Shadcn/UI
- TanStack Query
- React Hook Form
- Zod
- Supabase SSR

### Backend

- Java 21
- Spring Boot 3.3
- Spring Security
- JWT
- Spring Data JPA
- SpringDoc OpenAPI / Swagger
- Maven
- PostgreSQL

### Base de Datos y Servicios

- Supabase PostgreSQL 15
- Supabase Auth
- Supabase Storage
- Supabase Realtime

## Estructura General

```text
.
├── frontend/              # Aplicacion Next.js
├── backend/               # API REST Spring Boot
├── supabase/              # Migraciones, seed y configuracion Supabase
├── docker/                # Dockerfile del backend
├── .github/workflows/     # Pipeline CI
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Requisitos Locales

- Node.js 22 o superior
- Java JDK 21
- Maven 3.9 o superior
- Git
- Docker Desktop opcional
- Supabase CLI opcional para entorno local de base de datos

## Ejecutar Frontend

```powershell
cd frontend
Copy-Item .env.local.example .env.local
npm.cmd install
npm.cmd run dev
```

URL:

```text
http://localhost:3000
```

## Ejecutar Backend

```powershell
cd backend
Copy-Item .env.example .env
# Completar credenciales de Supabase en .env
.\run-local.ps1
```

> **Conexion a Supabase:** en redes IPv4-only usa el **Session pooler** del dashboard (host `aws-1-*.pooler.supabase.com`, usuario `postgres.[project-ref]`). La conexion directa `db.[ref].supabase.co` puede fallar en entornos locales.

Health check:

```text
http://localhost:8080/api/v1/health
```

Swagger:

```text
http://localhost:8080/swagger-ui.html
```

## Variables de Entorno

No subir archivos reales `.env` al repositorio.

Usar como base:

- `frontend/.env.local.example`
- `backend/.env.example`

## Flujo de Trabajo con Git

No trabajar directamente sobre `main` para nuevas funcionalidades.

```powershell
git checkout main
git pull origin main
git checkout -b feature/nombre-de-la-tarea
```

Al terminar:

```powershell
git add .
git commit -m "Descripcion clara del cambio"
git push origin feature/nombre-de-la-tarea
```

Luego crear un Pull Request hacia `main`.

## Estado Actual

| Fase | Estado | Contenido |
|------|--------|-----------|
| 0 | Completada | Monorepo, CI, Docker, health check, Swagger |
| 1 | Completada | Auth Supabase, JWT ES256/JWKS, roles, guards, `/auth/me` |
| **2** | **Completada** | **Catalogo bibliografico (libros, autores, categorias, editoriales)** |
| 3-8 | Pendiente | Ejemplares, prestamos, multas, reservas, reportes, auditoria |

### Fase 2 — Catalogo de libros

**Base de datos:** migracion `20260618000200_create_libros.sql` (tablas `autores`, `categorias`, `editoriales`, `libros`).

**Backend:** API REST `/api/v1/libros` con filtros, paginacion, ordenamiento, CRUD y baja logica. Endpoints de referencias para formularios. Seguridad: admin y bibliotecario (CRUD), estudiante (solo lectura).

**Frontend:**

- `/libros` — gestion completa (admin / bibliotecario)
- `/catalogo` — consulta publica (estudiante)

**Seed:** `supabase/seed/seed.sql` incluye 3 libros de ejemplo junto a los usuarios de prueba.

Usuarios de prueba y detalle de fases: ver [`docs/SGBU-Plan-de-Implementacion.pdf`](docs/SGBU-Plan-de-Implementacion.pdf) seccion 14.

### Rutas utiles (local)

| Rol | Ruta principal | Credenciales dev |
|-----|----------------|------------------|
| Admin | `/admin`, `/libros` | `admin@sgbu.dev` / `Admin123!` |
| Bibliotecario | `/biblioteca`, `/libros` | `bibliotecario@sgbu.dev` / `Biblio123!` |
| Estudiante | `/catalogo` | `estudiante1@sgbu.dev` / `Est123!` |

