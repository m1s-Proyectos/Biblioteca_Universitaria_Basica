package com.biblioteca.api.model.dto;

import com.biblioteca.api.model.entity.RolUsuario;

import java.util.UUID;

public record UsuarioResponse(
        UUID id,
        String nombre,
        String email,
        RolUsuario rol,
        String matricula
) {
}
