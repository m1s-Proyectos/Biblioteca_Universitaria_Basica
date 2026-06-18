package com.biblioteca.api.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JwtService {

    public Optional<Authentication> authenticate(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }

        return Optional.of(new UsernamePasswordAuthenticationToken(
                "supabase-user",
                token,
                List.of(new SimpleGrantedAuthority("ROLE_ESTUDIANTE"))
        ));
    }
}

