# Fase 1 - Usuarios de prueba (SOLO desarrollo)

Ejecutar en Supabase SQL Editor, en este orden:

1. `supabase/migrations/20260618000100_create_usuarios.sql`
2. `supabase/seed/seed.sql`

## Credenciales

| Rol | Email | Contrasena |
|-----|-------|------------|
| Admin | admin@sgbu.dev | Admin123! |
| Bibliotecario | bibliotecario@sgbu.dev | Biblio123! |
| Estudiante 1 | estudiante1@sgbu.dev | Est123! |
| Estudiante 2 | estudiante2@sgbu.dev | Est223! |

## Redireccion tras login

| Rol | Ruta home |
|-----|-----------|
| admin | /admin |
| bibliotecario | /biblioteca |
| estudiante | /catalogo |

**No usar estas credenciales en produccion.**
