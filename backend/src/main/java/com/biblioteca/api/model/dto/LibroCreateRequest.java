package com.biblioteca.api.model.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record LibroCreateRequest(
        @NotBlank(message = "El ISBN es obligatorio")
        @Size(max = 17, message = "El ISBN no puede superar 17 caracteres")
        @Pattern(regexp = "^[0-9Xx\\-]+$", message = "El ISBN solo puede contener digitos, X o guiones")
        String isbn,

        @NotBlank(message = "El titulo es obligatorio")
        @Size(max = 500, message = "El titulo no puede superar 500 caracteres")
        String titulo,

        @Size(max = 500, message = "El subtitulo no puede superar 500 caracteres")
        String subtitulo,

        @Size(max = 5000, message = "La descripcion no puede superar 5000 caracteres")
        String descripcion,

        @Min(value = 1000, message = "El anio de publicacion debe ser valido")
        @Max(value = 2100, message = "El anio de publicacion debe ser valido")
        Short anioPublicacion,

        @NotBlank(message = "El idioma es obligatorio")
        @Size(max = 10, message = "El idioma no puede superar 10 caracteres")
        String idioma,

        @Min(value = 1, message = "El numero de paginas debe ser positivo")
        Integer numeroPaginas,

        @Size(max = 2048, message = "La URL de portada no puede superar 2048 caracteres")
        @Pattern(regexp = "^(https?://.*)?$", message = "La URL de portada debe comenzar con http:// o https://")
        String portadaUrl,

        @NotNull(message = "El autor es obligatorio")
        UUID autorId,

        @NotNull(message = "La categoria es obligatoria")
        UUID categoriaId,

        @NotNull(message = "La editorial es obligatoria")
        UUID editorialId
) {
}
