package com.biblioteca.api.repository;

import com.biblioteca.api.model.entity.Autor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AutorRepository extends JpaRepository<Autor, UUID> {

    List<Autor> findByActivoTrueOrderByApellidoAscNombreAsc();
}
