package com.biblioteca.api.model.entity;

public enum RolUsuario {
    ADMIN,
    BIBLIOTECARIO,
    ESTUDIANTE;

    public String authority() {
        return "ROLE_" + name();
    }

    public static RolUsuario fromDbValue(String value) {
        return RolUsuario.valueOf(value.toUpperCase());
    }

    public String toDbValue() {
        return name().toLowerCase();
    }
}
