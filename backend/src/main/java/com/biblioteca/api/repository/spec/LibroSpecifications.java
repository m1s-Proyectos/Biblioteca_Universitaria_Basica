package com.biblioteca.api.repository.spec;

import com.biblioteca.api.model.entity.Autor;
import com.biblioteca.api.model.entity.Categoria;
import com.biblioteca.api.model.entity.Editorial;
import com.biblioteca.api.model.entity.Libro;
import com.biblioteca.api.service.dto.LibroFilterCriteria;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class LibroSpecifications {

    private LibroSpecifications() {
    }

    public static Specification<Libro> withFilters(LibroFilterCriteria filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.isbn() != null && !filter.isbn().isBlank()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("isbn")),
                        "%" + filter.isbn().trim().toLowerCase() + "%"
                ));
            }

            if (filter.titulo() != null && !filter.titulo().isBlank()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("titulo")),
                        "%" + filter.titulo().trim().toLowerCase() + "%"
                ));
            }

            if (filter.autor() != null && !filter.autor().isBlank()) {
                Join<Libro, Autor> autorJoin = root.join("autor");
                String term = "%" + filter.autor().trim().toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(autorJoin.get("nombre")), term),
                        criteriaBuilder.like(criteriaBuilder.lower(autorJoin.get("apellido")), term)
                ));
            }

            if (filter.editorial() != null && !filter.editorial().isBlank()) {
                Join<Libro, Editorial> editorialJoin = root.join("editorial");
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(editorialJoin.get("nombre")),
                        "%" + filter.editorial().trim().toLowerCase() + "%"
                ));
            }

            if (filter.categoriaId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("categoria").get("id"), filter.categoriaId()));
            } else if (filter.categoria() != null && !filter.categoria().isBlank()) {
                Join<Libro, Categoria> categoriaJoin = root.join("categoria");
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(categoriaJoin.get("nombre")),
                        "%" + filter.categoria().trim().toLowerCase() + "%"
                ));
            }

            if (filter.idioma() != null && !filter.idioma().isBlank()) {
                predicates.add(criteriaBuilder.equal(
                        criteriaBuilder.lower(root.get("idioma")),
                        filter.idioma().trim().toLowerCase()
                ));
            }

            if (filter.anio() != null) {
                predicates.add(criteriaBuilder.equal(root.get("anioPublicacion"), filter.anio()));
            }

            if (filter.activo() != null) {
                predicates.add(criteriaBuilder.equal(root.get("activo"), filter.activo()));
            }

            if (filter.q() != null && !filter.q().isBlank()) {
                String term = "%" + filter.q().trim().toLowerCase() + "%";
                Join<Libro, Autor> autorJoin = root.join("autor");
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("isbn")), term),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("titulo")), term),
                        criteriaBuilder.like(criteriaBuilder.lower(autorJoin.get("nombre")), term),
                        criteriaBuilder.like(criteriaBuilder.lower(autorJoin.get("apellido")), term)
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
