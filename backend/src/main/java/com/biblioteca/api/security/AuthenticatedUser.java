package com.biblioteca.api.security;

import com.biblioteca.api.model.entity.RolUsuario;

import java.util.UUID;

public record AuthenticatedUser(
        UUID id,
        String email,
        String nombre,
        RolUsuario rol,
        String matricula
) {
}
