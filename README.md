# Sistema de Gestion de Biblioteca Universitaria - Web

Proyecto base del Sistema de Gestion de Biblioteca Universitaria (SGBU) en version web.

> **Guia del equipo:** lee el plan completo en [`docs/SGBU-Plan-de-Implementacion.pdf`](docs/SGBU-Plan-de-Implementacion.pdf).  
> Ahi encontraras las fases del proyecto, arquitectura, flujo de trabajo Git, usuarios de prueba y el estado actual (Fase 1 completada).

El repositorio contiene el esqueleto profesional inicial para trabajar en equipo. La logica funcional completa de modulos como libros, prestamos, multas, reportes y administracion se implementara progresivamente.

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
mvn spring-boot:run
```

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

- Estructura base creada (Fase 0 completada).
- **Fase 1 completada:** autenticacion real, usuarios, roles, JWT, logout, guards.
- Frontend Next.js compilando.
- Backend Spring Boot levantando correctamente.
- Swagger y endpoint de salud disponibles.
- Migracion `usuarios` aplicada; migraciones 002-007 pendientes (Fase 2+).

Usuarios de prueba y detalle de la Fase 1: ver [`docs/SGBU-Plan-de-Implementacion.pdf`](docs/SGBU-Plan-de-Implementacion.pdf) seccion 14.

