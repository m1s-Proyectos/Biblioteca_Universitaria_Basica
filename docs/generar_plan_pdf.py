"""Genera el PDF del plan de implementacion SGBU."""

from __future__ import annotations

from pathlib import Path

from fpdf import FPDF

DOCS_DIR = Path(__file__).parent
OUTPUT = DOCS_DIR / "SGBU-Plan-de-Implementacion.pdf"


class PlanPDF(FPDF):
    def header(self) -> None:
        if self.page_no() == 1:
            return
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(100, 100, 100)
        self.cell(0, 8, "SGBU Web - Plan de Implementacion", align="R")
        self.ln(4)
        self.set_draw_color(200, 200, 200)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(6)

    def footer(self) -> None:
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 10, f"Pagina {self.page_no()}", align="C")

    def cover(self) -> None:
        self.add_page()
        self.ln(40)
        self.set_font("Helvetica", "B", 26)
        self.set_text_color(30, 64, 120)
        self.multi_cell(0, 12, "Sistema de Gestion de\nBiblioteca Universitaria", align="C")
        self.ln(6)
        self.set_font("Helvetica", "", 16)
        self.set_text_color(60, 60, 60)
        self.cell(0, 10, "Plan de Implementacion por Fases", align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(8)
        self.set_font("Helvetica", "", 12)
        self.cell(0, 8, "Version Web (SGBU)", align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(20)
        self.set_draw_color(30, 64, 120)
        self.set_line_width(0.8)
        self.line(60, self.get_y(), 150, self.get_y())
        self.ln(15)
        self.set_font("Helvetica", "", 11)
        self.set_text_color(80, 80, 80)
        meta = [
            "Proyecto: Biblioteca_Universitaria_Basica",
            "Stack: Next.js 15 + Spring Boot 3.3 + Supabase",
            "Documento para el equipo de desarrollo",
            "Fecha de inicio del plan: 19 de junio de 2026",
            "Ultima actualizacion: 19 de junio de 2026 - Fase 1 completada",
        ]
        for line in meta:
            self.cell(0, 8, line, align="C", new_x="LMARGIN", new_y="NEXT")

    def section_title(self, title: str) -> None:
        self.ln(4)
        self.set_font("Helvetica", "B", 14)
        self.set_text_color(30, 64, 120)
        self.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(30, 64, 120)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(6)

    def subsection(self, title: str) -> None:
        self.ln(2)
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(40, 40, 40)
        self.cell(0, 8, title, new_x="LMARGIN", new_y="NEXT")
        self.ln(2)

    def body(self, text: str) -> None:
        self.set_font("Helvetica", "", 10)
        self.set_text_color(30, 30, 30)
        self.set_x(self.l_margin)
        self.multi_cell(self.epw, 5.5, text)
        self.ln(2)

    def bullet_list(self, items: list[str]) -> None:
        self.set_font("Helvetica", "", 10)
        self.set_text_color(30, 30, 30)
        for item in items:
            self.set_x(self.l_margin)
            self.multi_cell(self.epw, 5.5, f"  -  {item}")
        self.ln(2)

    def table(self, headers: list[str], rows: list[list[str]], col_widths: list[int]) -> None:
        self.set_font("Helvetica", "B", 9)
        self.set_fill_color(30, 64, 120)
        self.set_text_color(255, 255, 255)
        for i, header in enumerate(headers):
            self.cell(col_widths[i], 8, header, border=1, fill=True)
        self.ln()
        self.set_font("Helvetica", "", 9)
        self.set_text_color(30, 30, 30)
        fill = False
        for row in rows:
            if fill:
                self.set_fill_color(245, 247, 250)
            else:
                self.set_fill_color(255, 255, 255)
            max_lines = 1
            cell_lines: list[list[str]] = []
            for i, cell in enumerate(row):
                lines = self.multi_cell(col_widths[i], 5, cell, dry_run=True, output="LINES")
                cell_lines.append(lines)
                max_lines = max(max_lines, len(lines))
            row_h = max(7, max_lines * 5)
            x0, y0 = self.get_x(), self.get_y()
            if y0 + row_h > 270:
                self.add_page()
                y0 = self.get_y()
            x = x0
            for i, lines in enumerate(cell_lines):
                self.set_xy(x, y0)
                self.rect(x, y0, col_widths[i], row_h, style="DF" if fill else "D")
                self.set_xy(x + 1, y0 + 1)
                self.multi_cell(col_widths[i] - 2, 5, row[i])
                x += col_widths[i]
            self.set_xy(x0, y0 + row_h)
            fill = not fill
        self.set_x(self.l_margin)
        self.ln(4)


def build_pdf() -> None:
    pdf = PlanPDF()
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.cover()

    pdf.add_page()
    pdf.section_title("1. Proposito del documento")
    pdf.body(
        "Este documento define el plan de trabajo por fases para implementar el Sistema de "
        "Gestion de Biblioteca Universitaria (SGBU) en su version web. Sirve como guia "
        "para todo el equipo: establece el orden de avance, los entregables de cada fase, "
        "las responsabilidades y las reglas de colaboracion con Git."
    )

    pdf.section_title("2. Estado actual del proyecto (Jun 2026)")
    pdf.table(
        ["Capa", "Estado", "Observacion"],
        [
            ["Infraestructura", "Completo", "Repo, CI, Docker, variables de entorno"],
            ["Conexion Supabase", "Completo", "Frontend y backend conectados a PostgreSQL"],
            ["Fase 1 - Auth y usuarios", "Completo", "Login, roles, JWT JWKS, logout, guards"],
            ["Migracion usuarios", "Completo", "001_create_usuarios.sql aplicada + seed"],
            ["Modulos de negocio", "Pendiente", "Libros, prestamos, multas (Fase 2 en adelante)"],
            ["Integracion FE-BE", "Completo", "apiFetch envia Bearer token automaticamente"],
        ],
        [45, 35, 100],
    )

    pdf.section_title("3. Arquitectura acordada")
    pdf.subsection("Stack tecnologico")
    pdf.bullet_list([
        "Frontend: Next.js 15, React 19, TypeScript, Tailwind, Shadcn/UI, TanStack Query",
        "Backend: Java 21, Spring Boot 3.3, Spring Security, JPA, OpenAPI/Swagger",
        "Base de datos: Supabase PostgreSQL 15, Supabase Auth, Storage, Realtime",
    ])
    pdf.subsection("Principios de arquitectura")
    pdf.bullet_list([
        "Supabase Auth autentica usuarios (login/registro).",
        "Spring Boot concentra la logica de negocio y acceso a datos via JPA.",
        "El frontend consume la API REST del backend (no PostgREST directo para negocio).",
        "Las migraciones SQL viven en supabase/migrations/ y se aplican al proyecto remoto.",
        "Avance por rebanadas verticales: BD + backend + frontend por modulo.",
    ])

    pdf.section_title("4. Roles de usuario del sistema")
    pdf.table(
        ["Rol", "Descripcion", "Permisos principales"],
        [
            ["ESTUDIANTE", "Usuario universitario", "Catalogo, sus prestamos, multas y reservas"],
            ["BIBLIOTECARIO", "Personal de biblioteca", "CRUD libros/ejemplares, prestamos, devoluciones"],
            ["ADMIN", "Administrador del sistema", "Usuarios, reportes, configuracion general"],
        ],
        [35, 45, 100],
    )

    pdf.section_title("5. Modelo de datos (resumen)")
    pdf.body(
        "El dominio se organiza en torno al catalogo (libros y ejemplares fisicos), "
        "las operaciones (prestamos, reservas, multas) y la trazabilidad (usuarios, auditoria)."
    )
    pdf.body("Relacion principal:")
    pdf.bullet_list([
        "auth.users (Supabase) -> public.usuarios (perfil + rol)",
        "libro -> muchos ejemplares (copias fisicas con estado)",
        "prestamo: usuario + ejemplar + fechas + estado",
        "multa: derivada de prestamo vencido",
        "reserva: usuario + libro (cuando no hay ejemplares disponibles)",
        "log_auditoria: registro transversal de cambios",
    ])
    pdf.body("Estados de ejemplar: DISPONIBLE | PRESTADO | RESERVADO | BAJA")
    pdf.body("Estados de prestamo: ACTIVO | DEVUELTO | VENCIDO")

    pdf.section_title("6. Metodologia de trabajo en equipo")
    pdf.subsection("Flujo Git (obligatorio)")
    pdf.bullet_list([
        "No trabajar directamente en main para nuevas funcionalidades.",
        "Crear branch: feature/nombre-modulo (ej. feature/usuarios-auth).",
        "Un branch por modulo o tarea acotada.",
        "Al terminar: commit claro, push y Pull Request hacia main.",
        "Revisar PR de un companero antes de merge cuando sea posible.",
    ])
    pdf.subsection("Orden de trabajo por modulo (cada fase)")
    pdf.body("Siempre seguir esta secuencia dentro de cada fase:")
    pdf.bullet_list([
        "1. Escribir migracion SQL en supabase/migrations/",
        "2. Aplicar en Supabase (SQL Editor o supabase db push)",
        "3. Backend: entity -> repository -> service -> controller -> DTOs",
        "4. Probar en Swagger (http://localhost:8080/swagger-ui.html)",
        "5. Frontend: types, hook TanStack Query, formulario, pagina",
        "6. Prueba manual end-to-end y PR",
    ])
    pdf.subsection("Division sugerida del equipo (2-3 personas)")
    pdf.table(
        ["Rol en sprint", "Responsabilidad"],
        [
            ["Dev Backend + BD", "Migraciones, entidades JPA, API REST, reglas de negocio"],
            ["Dev Frontend", "Pantallas, formularios, hooks, integracion con API"],
            ["Ambos / QA", "Pruebas manuales, revision de PR, documentacion Swagger"],
        ],
        [45, 135],
    )
    pdf.body(
        "Regla de oro: no iniciar una fase nueva hasta cerrar la anterior "
        "(merge a main + prueba exitosa)."
    )

    pdf.add_page()
    pdf.section_title("7. Fases de implementacion")
    pdf.body(
        "Fase 0 y Fase 1 completadas. El trabajo activo continua en la Fase 2 (Catalogo: Libros)."
    )

    phases = [
        (
            "Fase 0 - Esqueleto del proyecto [COMPLETADA]",
            "Objetivo: Proyecto compilable y ejecutable con estructura profesional.",
            [
                "Estructura monorepo: frontend, backend, supabase, docker, CI",
                "Login basico con Supabase Auth",
                "Backend con health check, Swagger, security skeleton",
                "Migraciones placeholder y conexion a Supabase configurada",
            ],
            "Repositorio base funcional. Health UP. Login carga correctamente.",
        ),
        (
            "Fase 1 - Usuarios y autenticacion real [COMPLETADA]",
            "Objetivo: Login util con roles; backend reconoce al usuario autenticado.",
            [
                "Migracion 001: tabla public.usuarios + ENUM rol_usuario + RLS",
                "Trigger PostgreSQL: sync automatico auth.users -> public.usuarios",
                "JwtService: validacion JWT via JWKS (ES256) de Supabase",
                "Endpoints: GET /api/v1/auth/me y GET /api/v1/auth/admin/ping",
                "apiFetch: Authorization Bearer automatico + manejo 401/403",
                "Frontend: header con nombre/email/rol, logout, guards por rol",
                "Rutas por rol: admin->/admin, bibliotecario->/biblioteca, estudiante->/catalogo",
                "Seed: 4 usuarios de prueba (ver seccion 13)",
            ],
            "Login end-to-end verificado. Backend identifica id, email y rol del usuario.",
        ),
        (
            "Fase 2 - Catalogo: Libros [PRIORIDAD INMEDIATA]",
            "Objetivo: El bibliotecario gestiona el catalogo bibliografico.",
            [
                "Migracion 002: autores, categorias, editoriales, libros",
                "API REST: CRUD /api/v1/libros con paginacion y busqueda",
                "Validacion: Bean Validation (backend) + Zod (frontend)",
                "Pantalla /libros: tabla, filtros, modal crear/editar",
                "Permisos: solo BIBLIOTECARIO y ADMIN pueden crear/editar",
            ],
            "Listar, crear, editar y buscar libros desde la aplicacion web.",
        ),
        (
            "Fase 3 - Ejemplares",
            "Objetivo: Gestionar copias fisicas del inventario.",
            [
                "Migracion 003: tabla ejemplares (libro_id, codigo, estado, ubicacion)",
                "Regla: un ejemplar solo puede tener un estado a la vez",
                "API: CRUD ejemplares, listado por libro",
                "Frontend: pestana Ejemplares en detalle de libro",
            ],
            "Ver cuantas copias existen y cuales estan disponibles por titulo.",
        ),
        (
            "Fase 4 - Prestamos (nucleo del sistema)",
            "Objetivo: Flujo principal de la biblioteca universitaria.",
            [
                "Migracion 004: prestamos (usuario, ejemplar, fechas, estado)",
                "Reglas: no prestar ejemplar no disponible; limite prestamos por estudiante",
                "API: POST /prestamos, PATCH /prestamos/{id}/devolver",
                "Actualizar estado del ejemplar al prestar/devolver",
                "Pantalla /prestamos: activos, historial, formulario nuevo prestamo",
            ],
            "Prestar y devolver un libro de punta a punta (MVP funcional al cerrar esta fase).",
        ),
        (
            "Fase 5 - Multas",
            "Objetivo: Gestion de cobros por devolucion tardia.",
            [
                "Migracion 005: multas (prestamo_id, monto, dias_atraso, estado)",
                "Logica: job batch (@Scheduled) o proceso al marcar prestamo vencido",
                "API: consultar multas, marcar como pagada",
                "Pantalla /multas: estudiante ve las suyas; bibliotecario gestiona",
            ],
            "Multas generadas automaticamente y visibles/gestionables en la app.",
        ),
        (
            "Fase 6 - Reservas",
            "Objetivo: Cola de espera cuando no hay ejemplares disponibles.",
            [
                "Migracion 006: reservas (usuario, libro, fecha, estado, notificado)",
                "Regla: notificar cuando un ejemplar vuelve a DISPONIBLE",
                "API: crear/cancelar reserva, listar por usuario",
                "Pantalla /reservas o seccion en libros",
            ],
            "Estudiante puede reservar un titulo sin copias disponibles.",
        ),
        (
            "Fase 7 - Reportes y administracion",
            "Objetivo: Vision gerencial y panel administrativo.",
            [
                "Endpoints de reportes: libros mas prestados, prestamos activos, multas pendientes",
                "Pantalla /reportes con graficos o tablas resumen",
                "Pantalla /admin: gestion de usuarios y roles",
                "Exportacion basica (CSV/PDF) opcional",
            ],
            "Administrador y bibliotecario tienen dashboards de gestion.",
        ),
        (
            "Fase 8 - Auditoria, calidad y cierre",
            "Objetivo: Trazabilidad, pruebas y preparacion para produccion.",
            [
                "Migracion 007: log_auditoria + triggers en tablas criticas",
                "Tests de integracion backend (Spring Boot Test)",
                "Tests E2E basicos frontend (opcional)",
                "Documentacion Swagger completa",
                "Revision de seguridad (RLS, roles, CORS, secretos)",
            ],
            "Sistema trazable, probado y listo para despliegue.",
        ),
    ]

    for title, objective, tasks, deliverable in phases:
        pdf.subsection(title)
        pdf.set_font("Helvetica", "B", 10)
        pdf.cell(0, 6, "Objetivo:", new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 10)
        pdf.multi_cell(0, 5.5, objective)
        pdf.ln(1)
        pdf.set_font("Helvetica", "B", 10)
        pdf.cell(0, 6, "Tareas:", new_x="LMARGIN", new_y="NEXT")
        pdf.bullet_list(tasks)
        pdf.set_font("Helvetica", "B", 10)
        pdf.cell(0, 6, "Entregable:", new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "I", 10)
        pdf.multi_cell(0, 5.5, deliverable)
        pdf.ln(3)

    pdf.add_page()
    pdf.section_title("8. Cronograma sugerido (referencia)")
    pdf.table(
        ["Semana", "Fase", "Foco principal"],
        [
            ["Semana 1", "Fase 1", "COMPLETADA - Usuarios, JWT, logout, roles"],
            ["Semana 2", "Fase 2", "CRUD libros + autores/categorias"],
            ["Semana 3", "Fase 3-4", "Ejemplares + prestamos (MVP)"],
            ["Semana 4", "Fase 5", "Multas automaticas"],
            ["Semana 5", "Fase 6", "Reservas"],
            ["Semana 6", "Fase 7-8", "Reportes, admin, auditoria, QA"],
        ],
        [30, 30, 120],
    )
    pdf.body(
        "Nota: el cronograma es orientativo. Ajusten segun disponibilidad del equipo. "
        "Lo importante es respetar el orden de fases y no saltar dependencias."
    )

    pdf.section_title("9. Definicion de MVP")
    pdf.body(
        "El Producto Minimo Viable (MVP) se alcanza al completar las Fases 1 a 4:"
    )
    pdf.bullet_list([
        "Login con roles (estudiante, bibliotecario, admin)",
        "Catalogo de libros consultable y editable",
        "Inventario de ejemplares con estados",
        "Prestamos y devoluciones funcionales",
    ])
    pdf.body(
        "Con el MVP el sistema ya es demostrable en contexto universitario. "
        "Multas, reservas y reportes son incrementos posteriores."
    )

    pdf.section_title("10. Deuda tecnica pendiente")
    pdf.bullet_list([
        "Migraciones 002-007: aun son placeholders (libros, prestamos, etc.)",
        "Regenerar database.types.ts automaticamente con Supabase CLI tras cada migracion",
        "Tests E2E frontend (opcional, Fase 8)",
        "Documentacion Swagger completa para modulos de negocio",
    ])

    pdf.section_title("11. Comandos utiles para el equipo")
    pdf.subsection("Frontend")
    pdf.body("cd frontend\nnpm install\nnpm run dev\n-> http://localhost:3000")
    pdf.subsection("Backend")
    pdf.body("cd backend\n.\\run-local.ps1\n-> http://localhost:8080/api/v1/health\n-> http://localhost:8080/swagger-ui.html")
    pdf.subsection("Git (inicio de tarea)")
    pdf.body(
        "git checkout main\n"
        "git pull origin main\n"
        "git checkout -b feature/nombre-modulo"
    )

    pdf.section_title("12. Criterios de aceptacion por fase")
    pdf.bullet_list([
        "Migracion aplicada en Supabase sin errores",
        "Endpoints documentados y probados en Swagger",
        "Pantalla frontend funcional con datos reales",
        "PR revisado y mergeado a main",
        "CI en verde (build frontend + test backend)",
    ])

    pdf.add_page()
    pdf.section_title("13. Fase 1 completada - Resumen tecnico")
    pdf.subsection("Que se implemento")
    pdf.bullet_list([
        "Tabla public.usuarios con roles: admin, bibliotecario, estudiante",
        "Trigger PostgreSQL para sincronizar auth.users con public.usuarios",
        "Validacion JWT en backend via JWKS (Supabase ES256)",
        "Endpoints protegidos: /api/v1/auth/me y /api/v1/auth/admin/ping",
        "Frontend: login, logout, header con perfil, guards por rol en middleware",
        "Redireccion automatica: admin->/admin, bibliotecario->/biblioteca, estudiante->/catalogo",
    ])
    pdf.subsection("Archivos clave")
    pdf.bullet_list([
        "supabase/migrations/20260618000100_create_usuarios.sql",
        "supabase/seed/seed.sql",
        "backend: JwtService, AuthController, Usuario entity",
        "frontend: middleware.ts, lib/auth/roles.ts, lib/api/client.ts",
    ])
    pdf.subsection("Como probar la Fase 1")
    pdf.body(
        "1. Levantar backend: cd backend && .\\run-local.ps1\n"
        "2. Levantar frontend: cd frontend && npm run dev\n"
        "3. Abrir http://localhost:3000/login\n"
        "4. Iniciar sesion con cualquier usuario de la tabla de la seccion 14\n"
        "5. Verificar redireccion por rol, header con datos y boton cerrar sesion\n"
        "6. Probar backend: GET http://localhost:8080/api/v1/auth/me (con token Bearer)"
    )

    pdf.section_title("14. Usuarios de prueba (SOLO desarrollo)")
    pdf.body(
        "Usar estas credenciales para probar login y roles. "
        "Las contrasenas NO se pueden ver en Supabase (estan hasheadas con bcrypt). "
        "Documentadas en supabase/seed/USUARIOS-DEV.md."
    )
    pdf.table(
        ["Rol", "Email", "Contrasena", "Ruta tras login"],
        [
            ["Admin", "admin@sgbu.dev", "Admin123!", "/admin"],
            ["Bibliotecario", "bibliotecario@sgbu.dev", "Biblio123!", "/biblioteca"],
            ["Estudiante 1", "estudiante1@sgbu.dev", "Est123!", "/catalogo"],
            ["Estudiante 2", "estudiante2@sgbu.dev", "Est223!", "/catalogo"],
        ],
        [30, 55, 35, 40],
    )
    pdf.body("IMPORTANTE: No usar estas credenciales en produccion.")

    pdf.section_title("15. Checklist Fase 1")
    pdf.table(
        ["Item", "Estado"],
        [
            ["Login funciona", "OK"],
            ["Logout funciona", "OK"],
            ["JWT validado en backend (JWKS)", "OK"],
            ["Roles y redireccion por rol", "OK"],
            ["Header muestra usuario", "OK"],
            ["Rutas protegidas por rol", "OK"],
            ["Seed cargado en Supabase", "OK"],
            ["Tests backend pasan (mvn test)", "OK"],
        ],
        [120, 50],
    )

    pdf.ln(6)
    pdf.set_font("Helvetica", "I", 10)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(
        0,
        5.5,
        "Documento generado para el equipo SGBU. "
        "Actualizar este plan si cambian requisitos o prioridades del proyecto.",
    )

    pdf.output(OUTPUT)
    print(f"PDF generado: {OUTPUT}")


if __name__ == "__main__":
    build_pdf()
