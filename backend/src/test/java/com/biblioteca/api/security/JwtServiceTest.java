package com.biblioteca.api.security;

import com.biblioteca.api.model.entity.RolUsuario;
import com.biblioteca.api.model.entity.Usuario;
import com.biblioteca.api.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    private static final String SUPABASE_URL = "https://test.supabase.co";

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private JwtDecoder jwtDecoder;

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(usuarioRepository, SUPABASE_URL);
        jwtService.configureDecoderForTests(jwtDecoder);
    }

    @Test
    void authenticateReturnsUserWhenTokenIsValid() {
        UUID userId = UUID.randomUUID();
        Usuario usuario = buildUsuario(userId, "estudiante1@sgbu.dev", RolUsuario.ESTUDIANTE);
        when(jwtDecoder.decode(anyString())).thenReturn(buildJwt(userId));
        when(usuarioRepository.findById(userId)).thenReturn(Optional.of(usuario));

        Optional<Authentication> authentication = jwtService.authenticate("valid-token");

        assertThat(authentication).isPresent();
        AuthenticatedUser principal = (AuthenticatedUser) authentication.get().getPrincipal();
        assertThat(principal.id()).isEqualTo(userId);
        assertThat(principal.email()).isEqualTo("estudiante1@sgbu.dev");
        assertThat(principal.rol()).isEqualTo(RolUsuario.ESTUDIANTE);
    }

    @Test
    void authenticateReturnsEmptyWhenUserDoesNotExist() {
        UUID userId = UUID.randomUUID();
        when(jwtDecoder.decode(anyString())).thenReturn(buildJwt(userId));
        when(usuarioRepository.findById(userId)).thenReturn(Optional.empty());

        Optional<Authentication> authentication = jwtService.authenticate("valid-token");

        assertThat(authentication).isEmpty();
    }

    @Test
    void authenticateReturnsEmptyWhenTokenIsInvalid() {
        when(jwtDecoder.decode(anyString())).thenThrow(new org.springframework.security.oauth2.jwt.JwtException("invalid"));

        Optional<Authentication> authentication = jwtService.authenticate("token-invalido");

        assertThat(authentication).isEmpty();
    }

    private Usuario buildUsuario(UUID id, String email, RolUsuario rol) {
        Usuario usuario = new Usuario();
        usuario.setId(id);
        usuario.setEmail(email);
        usuario.setNombre("Usuario Test");
        usuario.setRol(rol);
        usuario.setMatricula("EST-999");
        return usuario;
    }

    private Jwt buildJwt(UUID userId) {
        return Jwt.withTokenValue("token")
                .header("alg", "ES256")
                .subject(userId.toString())
                .issuer(SUPABASE_URL + "/auth/v1")
                .claim("email", "estudiante1@sgbu.dev")
                .expiresAt(Instant.now().plusSeconds(3600))
                .issuedAt(Instant.now())
                .build();
    }
}
