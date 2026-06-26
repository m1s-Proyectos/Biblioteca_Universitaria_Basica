package com.biblioteca.api.service.impl;

import com.biblioteca.api.exception.ConflictException;
import com.biblioteca.api.exception.ResourceNotFoundException;
import com.biblioteca.api.mapper.LibroMapper;
import com.biblioteca.api.model.dto.LibroCreateRequest;
import com.biblioteca.api.model.dto.LibroResponse;
import com.biblioteca.api.model.dto.LibroUpdateRequest;
import com.biblioteca.api.model.dto.PageResponse;
import com.biblioteca.api.model.entity.Autor;
import com.biblioteca.api.model.entity.BaseEntity;
import com.biblioteca.api.model.entity.Categoria;
import com.biblioteca.api.model.entity.Editorial;
import com.biblioteca.api.model.entity.Libro;
import com.biblioteca.api.repository.AutorRepository;
import com.biblioteca.api.repository.CategoriaRepository;
import com.biblioteca.api.repository.EditorialRepository;
import com.biblioteca.api.repository.LibroRepository;
import com.biblioteca.api.repository.spec.LibroSpecifications;
import com.biblioteca.api.service.LibroService;
import com.biblioteca.api.service.dto.LibroFilterCriteria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class LibroServiceImpl implements LibroService {

    private final LibroRepository libroRepository;
    private final AutorRepository autorRepository;
    private final CategoriaRepository categoriaRepository;
    private final EditorialRepository editorialRepository;

    public LibroServiceImpl(
            LibroRepository libroRepository,
            AutorRepository autorRepository,
            CategoriaRepository categoriaRepository,
            EditorialRepository editorialRepository
    ) {
        this.libroRepository = libroRepository;
        this.autorRepository = autorRepository;
        this.categoriaRepository = categoriaRepository;
        this.editorialRepository = editorialRepository;
    }

    @Override
    public PageResponse<LibroResponse> findAll(LibroFilterCriteria filter, Pageable pageable) {
        Page<Libro> page = libroRepository.findAll(LibroSpecifications.withFilters(filter), pageable);
        return new PageResponse<>(
                page.getContent().stream().map(LibroMapper::toResponse).toList(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    @Override
    public LibroResponse findById(UUID id) {
        Libro libro = libroRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Libro", id));
        return LibroMapper.toResponse(libro);
    }

    @Override
    @Transactional
    public LibroResponse create(LibroCreateRequest request) {
        if (libroRepository.existsByIsbn(request.isbn())) {
            throw new ConflictException("Ya existe un libro con el ISBN " + request.isbn());
        }

        Libro libro = new Libro();
        assignNewEntityMetadata(libro);
        applyRequest(libro, request);
        Libro saved = libroRepository.save(libro);
        return findById(saved.getId());
    }

    @Override
    @Transactional
    public LibroResponse update(UUID id, LibroUpdateRequest request) {
        Libro libro = libroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Libro", id));

        if (libroRepository.existsByIsbnAndIdNot(request.isbn(), id)) {
            throw new ConflictException("Ya existe otro libro con el ISBN " + request.isbn());
        }

        applyRequest(libro, request);
        libro.setUpdatedAt(OffsetDateTime.now());
        libroRepository.save(libro);
        return findById(id);
    }

    @Override
    @Transactional
    public LibroResponse softDelete(UUID id) {
        Libro libro = libroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Libro", id));

        libro.setActivo(false);
        libro.setUpdatedAt(OffsetDateTime.now());
        libroRepository.save(libro);
        return findById(id);
    }

    private void applyRequest(Libro libro, LibroCreateRequest request) {
        Autor autor = autorRepository.findById(request.autorId())
                .orElseThrow(() -> new ResourceNotFoundException("Autor", request.autorId()));
        Categoria categoria = categoriaRepository.findById(request.categoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", request.categoriaId()));
        Editorial editorial = editorialRepository.findById(request.editorialId())
                .orElseThrow(() -> new ResourceNotFoundException("Editorial", request.editorialId()));

        libro.setIsbn(request.isbn().trim());
        libro.setTitulo(request.titulo().trim());
        libro.setSubtitulo(trimToNull(request.subtitulo()));
        libro.setDescripcion(trimToNull(request.descripcion()));
        libro.setAnioPublicacion(request.anioPublicacion());
        libro.setIdioma(request.idioma().trim().toLowerCase());
        libro.setNumeroPaginas(request.numeroPaginas());
        libro.setPortadaUrl(trimToNull(request.portadaUrl()));
        libro.setAutor(autor);
        libro.setCategoria(categoria);
        libro.setEditorial(editorial);
        libro.setActivo(true);
    }

    private void applyRequest(Libro libro, LibroUpdateRequest request) {
        applyRequest(libro, new LibroCreateRequest(
                request.isbn(),
                request.titulo(),
                request.subtitulo(),
                request.descripcion(),
                request.anioPublicacion(),
                request.idioma(),
                request.numeroPaginas(),
                request.portadaUrl(),
                request.autorId(),
                request.categoriaId(),
                request.editorialId()
        ));
    }

    private void assignNewEntityMetadata(BaseEntity entity) {
        OffsetDateTime now = OffsetDateTime.now();
        entity.setId(UUID.randomUUID());
        entity.setCreatedAt(now);
        entity.setUpdatedAt(now);
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
