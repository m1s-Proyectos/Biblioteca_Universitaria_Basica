package com.biblioteca.api.controller;

import com.biblioteca.api.model.dto.ApiResponse;
import com.biblioteca.api.model.dto.AutorSummaryResponse;
import com.biblioteca.api.model.dto.CategoriaSummaryResponse;
import com.biblioteca.api.model.dto.EditorialSummaryResponse;
import com.biblioteca.api.model.dto.LibroCreateRequest;
import com.biblioteca.api.model.dto.LibroResponse;
import com.biblioteca.api.model.dto.LibroUpdateRequest;
import com.biblioteca.api.model.dto.PageResponse;
import com.biblioteca.api.service.CatalogoReferenciaService;
import com.biblioteca.api.service.LibroService;
import com.biblioteca.api.service.dto.LibroFilterCriteria;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/libros")
@Tag(name = "Libros", description = "Catalogo bibliografico")
@SecurityRequirement(name = "bearerAuth")
public class LibroController {

    private final LibroService libroService;
    private final CatalogoReferenciaService catalogoReferenciaService;

    public LibroController(LibroService libroService, CatalogoReferenciaService catalogoReferenciaService) {
        this.libroService = libroService;
        this.catalogoReferenciaService = catalogoReferenciaService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','BIBLIOTECARIO','ESTUDIANTE')")
    @Operation(summary = "Listar libros con filtros, paginacion y ordenamiento")
    public ApiResponse<PageResponse<LibroResponse>> list(
            @RequestParam(required = false) String isbn,
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false) String autor,
            @RequestParam(required = false) String editorial,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) UUID categoriaId,
            @RequestParam(required = false) String idioma,
            @RequestParam(required = false) Short anio,
            @RequestParam(required = false) Boolean activo,
            @RequestParam(required = false) String q,
            @PageableDefault(size = 10, sort = "titulo", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        LibroFilterCriteria filter = new LibroFilterCriteria(
                isbn, titulo, autor, editorial, categoria, categoriaId, idioma, anio, activo, q
        );
        return new ApiResponse<>(libroService.findAll(filter, pageable), "Libros obtenidos correctamente");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','BIBLIOTECARIO','ESTUDIANTE')")
    @Operation(summary = "Obtener libro por ID")
    public ApiResponse<LibroResponse> getById(@PathVariable UUID id) {
        return new ApiResponse<>(libroService.findById(id), "Libro obtenido correctamente");
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN','BIBLIOTECARIO')")
    @Operation(summary = "Crear libro")
    public ApiResponse<LibroResponse> create(@Valid @RequestBody LibroCreateRequest request) {
        return new ApiResponse<>(libroService.create(request), "Libro creado correctamente");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','BIBLIOTECARIO')")
    @Operation(summary = "Actualizar libro")
    public ApiResponse<LibroResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody LibroUpdateRequest request
    ) {
        return new ApiResponse<>(libroService.update(id, request), "Libro actualizado correctamente");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','BIBLIOTECARIO')")
    @Operation(summary = "Eliminar libro (logico)")
    public ApiResponse<LibroResponse> softDelete(@PathVariable UUID id) {
        return new ApiResponse<>(libroService.softDelete(id), "Libro desactivado correctamente");
    }

    @GetMapping("/referencias/autores")
    @PreAuthorize("hasAnyRole('ADMIN','BIBLIOTECARIO','ESTUDIANTE')")
    @Operation(summary = "Listar autores activos para formularios")
    public ApiResponse<List<AutorSummaryResponse>> listAutores() {
        return new ApiResponse<>(catalogoReferenciaService.listAutoresActivos(), "Autores obtenidos correctamente");
    }

    @GetMapping("/referencias/categorias")
    @PreAuthorize("hasAnyRole('ADMIN','BIBLIOTECARIO','ESTUDIANTE')")
    @Operation(summary = "Listar categorias activas para formularios")
    public ApiResponse<List<CategoriaSummaryResponse>> listCategorias() {
        return new ApiResponse<>(catalogoReferenciaService.listCategoriasActivas(), "Categorias obtenidas correctamente");
    }

    @GetMapping("/referencias/editoriales")
    @PreAuthorize("hasAnyRole('ADMIN','BIBLIOTECARIO','ESTUDIANTE')")
    @Operation(summary = "Listar editoriales activas para formularios")
    public ApiResponse<List<EditorialSummaryResponse>> listEditoriales() {
        return new ApiResponse<>(catalogoReferenciaService.listEditorialesActivas(), "Editoriales obtenidas correctamente");
    }
}
