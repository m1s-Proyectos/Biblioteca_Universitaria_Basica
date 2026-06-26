package com.biblioteca.api.model.dto;

import java.util.UUID;

public record AutorSummaryResponse(
        UUID id,
        String nombre,
        String apellido,
        String nombreCompleto
) {
}
