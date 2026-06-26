package com.biblioteca.api.repository;

import com.biblioteca.api.model.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CategoriaRepository extends JpaRepository<Categoria, UUID> {

    List<Categoria> findByActivoTrueOrderByNombreAsc();
}
