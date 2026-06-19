package com.biblioteca.api.controller;

import com.biblioteca.api.model.entity.RolUsuario;
import com.biblioteca.api.model.dto.ApiResponse;
import com.biblioteca.api.model.dto.UsuarioResponse;
import com.biblioteca.api.security.AuthenticatedUser;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class AuthControllerTest {

    @Test
    void meReturnsAuthenticatedProfile() {
        AuthController controller = new AuthController();
        UUID userId = UUID.randomUUID();
        AuthenticatedUser currentUser = new AuthenticatedUser(
                userId,
                "admin@sgbu.dev",
                "Admin SGBU",
                RolUsuario.ADMIN,
                "ADM-001"
        );

        ApiResponse<UsuarioResponse> response = controller.me(currentUser);

        assertThat(response.data().email()).isEqualTo("admin@sgbu.dev");
        assertThat(response.data().rol()).isEqualTo(RolUsuario.ADMIN);
        assertThat(response.data().matricula()).isEqualTo("ADM-001");
    }
}
