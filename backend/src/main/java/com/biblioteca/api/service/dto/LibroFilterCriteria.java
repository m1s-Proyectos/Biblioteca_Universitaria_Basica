package com.biblioteca.api.service.dto;

import java.util.UUID;

public record LibroFilterCriteria(
        String isbn,
        String titulo,
        String autor,
        String editorial,
        String categoria,
        UUID categoriaId,
        String idioma,
        Short anio,
        Boolean activo,
        String q
) {
}
