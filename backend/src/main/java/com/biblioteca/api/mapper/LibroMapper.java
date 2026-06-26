package com.biblioteca.api.mapper;

import com.biblioteca.api.model.dto.AutorSummaryResponse;
import com.biblioteca.api.model.dto.CategoriaSummaryResponse;
import com.biblioteca.api.model.dto.EditorialSummaryResponse;
import com.biblioteca.api.model.dto.LibroResponse;
import com.biblioteca.api.model.entity.Autor;
import com.biblioteca.api.model.entity.Categoria;
import com.biblioteca.api.model.entity.Editorial;
import com.biblioteca.api.model.entity.Libro;

public final class LibroMapper {

    private LibroMapper() {
    }

    public static LibroResponse toResponse(Libro libro) {
        return new LibroResponse(
                libro.getId(),
                libro.getIsbn(),
                libro.getTitulo(),
                libro.getSubtitulo(),
                libro.getDescripcion(),
                libro.getAnioPublicacion(),
                libro.getIdioma(),
                libro.getNumeroPaginas(),
                libro.getPortadaUrl(),
                toAutorSummary(libro.getAutor()),
                toCategoriaSummary(libro.getCategoria()),
                toEditorialSummary(libro.getEditorial()),
                libro.isActivo(),
                libro.getCreatedAt(),
                libro.getUpdatedAt()
        );
    }

    public static AutorSummaryResponse toAutorSummary(Autor autor) {
        return new AutorSummaryResponse(
                autor.getId(),
                autor.getNombre(),
                autor.getApellido(),
                autor.nombreCompleto()
        );
    }

    public static CategoriaSummaryResponse toCategoriaSummary(Categoria categoria) {
        return new CategoriaSummaryResponse(categoria.getId(), categoria.getNombre());
    }

    public static EditorialSummaryResponse toEditorialSummary(Editorial editorial) {
        return new EditorialSummaryResponse(editorial.getId(), editorial.getNombre());
    }
}
