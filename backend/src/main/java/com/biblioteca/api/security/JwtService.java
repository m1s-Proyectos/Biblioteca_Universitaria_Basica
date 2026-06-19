package com.biblioteca.api.security;

import com.biblioteca.api.model.entity.Usuario;
import com.biblioteca.api.repository.UsuarioRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class JwtService {

    private final UsuarioRepository usuarioRepository;
    private final String expectedIssuer;
    private JwtDecoder jwtDecoder;

    public JwtService(
            UsuarioRepository usuarioRepository,
            @Value("${app.supabase.url}") String supabaseUrl
    ) {
        this.usuarioRepository = usuarioRepository;
        this.expectedIssuer = supabaseUrl.endsWith("/")
                ? supabaseUrl + "auth/v1"
                : supabaseUrl + "/auth/v1";
    }

    @PostConstruct
    void init() {
        // Supabase moderno firma JWT con ES256 (JWKS). Legacy HS256 ya no aplica en proyectos nuevos.
        jwtDecoder = JwtDecoders.fromIssuerLocation(expectedIssuer);
    }

    void configureDecoderForTests(JwtDecoder decoder) {
        this.jwtDecoder = decoder;
    }

    public Optional<Authentication> authenticate(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }

        try {
            Jwt jwt = jwtDecoder.decode(token);
            validateClaims(jwt);

            UUID userId = UUID.fromString(jwt.getSubject());
            Usuario usuario = usuarioRepository.findById(userId).orElse(null);
            if (usuario == null || usuario.getRol() == null) {
                return Optional.empty();
            }

            AuthenticatedUser principal = new AuthenticatedUser(
                    usuario.getId(),
                    usuario.getEmail(),
                    usuario.getNombre(),
                    usuario.getRol(),
                    usuario.getMatricula()
            );

            return Optional.of(new UsernamePasswordAuthenticationToken(
                    principal,
                    token,
                    List.of(new SimpleGrantedAuthority(usuario.getRol().authority()))
            ));
        } catch (JwtException | IllegalArgumentException ex) {
            return Optional.empty();
        }
    }

    private void validateClaims(Jwt jwt) {
        if (jwt.getExpiresAt() != null && jwt.getExpiresAt().isBefore(java.time.Instant.now())) {
            throw new JwtException("Token expirado");
        }

        String issuer = jwt.getIssuer() != null ? jwt.getIssuer().toString() : null;
        if (issuer != null && !issuer.equals(expectedIssuer)) {
            throw new JwtException("Issuer invalido");
        }

        if (jwt.getSubject() == null || jwt.getSubject().isBlank()) {
            throw new JwtException("Subject ausente");
        }
    }
}
