package com.biblioteca.api.repository;

import com.biblioteca.api.model.entity.Libro;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface LibroRepository extends JpaRepository<Libro, UUID>, JpaSpecificationExecutor<Libro> {

    boolean existsByIsbnAndIdNot(String isbn, UUID id);

    boolean existsByIsbn(String isbn);

    @EntityGraph(attributePaths = {"autor", "categoria", "editorial"})
    Page<Libro> findAll(Specification<Libro> spec, Pageable pageable);

    @Query("""
            SELECT l FROM Libro l
            JOIN FETCH l.autor
            JOIN FETCH l.categoria
            JOIN FETCH l.editorial
            WHERE l.id = :id
            """)
    Optional<Libro> findByIdWithRelations(@Param("id") UUID id);
}
