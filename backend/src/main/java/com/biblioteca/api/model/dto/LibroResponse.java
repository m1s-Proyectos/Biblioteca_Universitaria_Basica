package com.biblioteca.api.model.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record LibroResponse(
        UUID id,
        String isbn,
        String titulo,
        String subtitulo,
        String descripcion,
        Short anioPublicacion,
        String idioma,
        Integer numeroPaginas,
        String portadaUrl,
        AutorSummaryResponse autor,
        CategoriaSummaryResponse categoria,
        EditorialSummaryResponse editorial,
        boolean activo,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}
