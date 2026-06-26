# Reparto de trabajo SGBU — Por panel (Estudiante / Bibliotecario / Admin)

> Documento de referencia para el equipo.  
> Estado base: **Fase 0 y Fase 1 completadas** en `main`.  
> Rama personal del líder: **`Frank`**.

---

## Idea general

Dividir el trabajo **por panel (rol)** en el **frontend**, pero centralizar **migraciones y API** en una persona (líder / rama `Frank`) para evitar conflictos en base de datos y backend.

---

## Rutas actuales por rol

| Rol | Rutas home / principales |
|-----|--------------------------|
| **Estudiante** | `/catalogo`, `/prestamos`, `/multas` |
| **Bibliotecario** | `/biblioteca`, `/libros`, `/prestamos`, `/multas` |
| **Admin** | `/admin`, `/reportes` |

Los guards por rol y login ya están implementados (Fase 1).

---

## Dependencias entre fases (no saltar)

```text
Fase 1 (usuarios/auth) ✅
         │
         └──► Fase 2 Libros
                    │
         ┌──────────┼──────────┐
         ▼          ▼          ▼
   Panel Estudiante   Panel Bibliotecario   Panel Admin
   (ver catálogo)     (CRUD + operaciones)  (usuarios + reportes)
                    │
              Fase 3 Ejemplares
                    │
              Fase 4 Préstamos
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
   Estudiante: mis datos   Bibliotecario: gestionar
   Admin: reportes (con datos reales)
```

| Panel | ¿Puede ir solo desde ya? | Depende de |
|-------|--------------------------|------------|
| Estudiante | Parcial (UI mock al inicio) | Fase 2 para catálogo real |
| Bibliotecario | No mucho aún | Fases 2 → 3 → 4 (core del sistema) |
| Admin | Parcial | Usuarios ✅; reportes reales en Fase 7 |

---

## Reparto recomendado (equipo de 3)

### Persona 1 — Panel Bibliotecario (+ backend core)
**Rama sugerida:** `Frank` (líder) o `feature/panel-bibliotecario`

- Fase 2: migración + API libros
- Fase 3: ejemplares
- Fase 4: préstamos / devoluciones
- Pantallas: `/biblioteca`, `/libros`, `/prestamos`, `/multas`

**Responsable principal de BD, migraciones y APIs.**

---

### Persona 2 — Panel Estudiante
**Rama sugerida:** `feature/panel-estudiante`

- Pantalla `/catalogo` (consulta libros, solo lectura)
- `/prestamos` y `/multas` (solo los **propios** del usuario)
- Fase 6: reservas (cuando exista catálogo)

**Puede empezar UI con mock; conectar API cuando exista `GET /libros`.**

---

### Persona 3 — Panel Admin
**Rama sugerida:** `feature/panel-admin`

- Mejorar `/admin` (gestión usuarios / roles)
- `/reportes` (cuando haya préstamos y multas)
- Documentación, tests, CI, PDF del plan

**Al inicio: UI admin + usuarios; reportes reales más adelante.**

---

## Reglas del equipo (importante)

### 1. Backend y migraciones — una sola persona
Los tres paneles usan la **misma API**. No editar migraciones en paralelo.

### 2. Componentes compartidos (frontend)
Evitar tres implementaciones distintas de “lista de libros”:

```text
components/features/libros/
  ├── libro-table.tsx      ← compartido
  ├── libro-form.tsx       ← bibliotecario / admin
  └── catalogo-grid.tsx    ← estudiante (solo lectura)
```

### 3. Misma API; el rol limita permisos

| Endpoint | Estudiante | Bibliotecario | Admin |
|----------|:----------:|:-------------:|:-----:|
| `GET /libros` | ✅ | ✅ | ✅ |
| `POST /libros` | ❌ | ✅ | ✅ |
| `GET /prestamos/mios` | ✅ | — | — |
| `GET /prestamos` | ❌ | ✅ | ✅ |

### 4. Git — flujo obligatorio
- Una rama por persona (`Frank`, `feature/panel-estudiante`, etc.)
- PR hacia `main` (CI en verde antes de merge)
- Sincronizar con `main` cada día:

```powershell
git checkout Frank
git pull origin main
```

### 5. PRs pequeños
Preferir varios PRs acotados, no “panel completo” en uno solo.

---

## Plan sugerido — próximas 2 semanas

| Semana | Frank / Bibliotecario (core) | Panel estudiante | Panel admin |
|--------|------------------------------|------------------|-------------|
| **1** | Fase 2: libros (BD + API) | Mock UI `/catalogo` | UI `/admin` + usuarios |
| **2** | Fase 3–4: ejemplares + préstamos | Conectar catálogo real | Reportes básicos (si hay datos) |

---

## Usuarios de prueba (login)

| Rol | Email | Contraseña | Home |
|-----|-------|------------|------|
| Admin | admin@sgbu.dev | Admin123! | /admin |
| Bibliotecario | bibliotecario@sgbu.dev | Biblio123! | /biblioteca |
| Estudiante | estudiante1@sgbu.dev | Est123! | /catalogo |

Detalle: `supabase/seed/USUARIOS-DEV.md` y PDF sección 14.

---

## Documentos relacionados

- Plan completo por fases: `docs/SGBU-Plan-de-Implementacion.pdf`
- Regenerar PDF: `python docs/generar_plan_pdf.py`

---

## Próximo paso (mañana)

1. Acordar quién es Persona 1 / 2 / 3
2. Crear ramas en GitHub
3. Empezar **Fase 2 (Libros)** desde `Frank` → migración + API
4. Los otros pueden avanzar UI con mock mientras se define el contrato API

---

*Última actualización: 19 de junio de 2026*
