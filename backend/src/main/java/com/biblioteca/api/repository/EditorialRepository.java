package com.biblioteca.api.repository;

import com.biblioteca.api.model.entity.Editorial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EditorialRepository extends JpaRepository<Editorial, UUID> {

    List<Editorial> findByActivoTrueOrderByNombreAsc();
}
