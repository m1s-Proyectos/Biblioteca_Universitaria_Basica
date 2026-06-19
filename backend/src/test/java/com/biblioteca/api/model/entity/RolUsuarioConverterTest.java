package com.biblioteca.api.model.entity;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class RolUsuarioConverterTest {

    private final RolUsuarioConverter converter = new RolUsuarioConverter();

    @Test
    void convertsBetweenEntityAndDatabaseValues() {
        assertThat(converter.convertToDatabaseColumn(RolUsuario.BIBLIOTECARIO)).isEqualTo("bibliotecario");
        assertThat(converter.convertToEntityAttribute("admin")).isEqualTo(RolUsuario.ADMIN);
    }
}
