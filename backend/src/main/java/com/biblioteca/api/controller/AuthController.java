package com.biblioteca.api.controller;

import com.biblioteca.api.model.dto.ApiResponse;
import com.biblioteca.api.model.dto.UsuarioResponse;
import com.biblioteca.api.security.AuthenticatedUser;
import com.biblioteca.api.security.CurrentUser;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @GetMapping("/me")
    public ApiResponse<UsuarioResponse> me(@CurrentUser AuthenticatedUser currentUser) {
        return new ApiResponse<>(
                new UsuarioResponse(
                        currentUser.id(),
                        currentUser.nombre(),
                        currentUser.email(),
                        currentUser.rol(),
                        currentUser.matricula()
                ),
                "Perfil obtenido correctamente"
        );
    }

    @GetMapping("/admin/ping")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<String> adminPing() {
        return new ApiResponse<>("pong", "Acceso admin confirmado");
    }
}
