package com.biblioteca.api.model.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class RolUsuarioConverter implements AttributeConverter<RolUsuario, String> {

    @Override
    public String convertToDatabaseColumn(RolUsuario rol) {
        return rol == null ? null : rol.toDbValue();
    }

    @Override
    public RolUsuario convertToEntityAttribute(String dbValue) {
        return dbValue == null ? null : RolUsuario.fromDbValue(dbValue);
    }
}
