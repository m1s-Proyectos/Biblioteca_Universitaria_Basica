package com.biblioteca.api.service.impl;

import com.biblioteca.api.exception.ConflictException;
import com.biblioteca.api.exception.ResourceNotFoundException;
import com.biblioteca.api.mapper.LibroMapper;
import com.biblioteca.api.model.dto.LibroCreateRequest;
import com.biblioteca.api.model.dto.LibroResponse;
import com.biblioteca.api.model.entity.Autor;
import com.biblioteca.api.model.entity.Categoria;
import com.biblioteca.api.model.entity.Editorial;
import com.biblioteca.api.model.entity.Libro;
import com.biblioteca.api.repository.AutorRepository;
import com.biblioteca.api.repository.CategoriaRepository;
import com.biblioteca.api.repository.EditorialRepository;
import com.biblioteca.api.repository.LibroRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LibroServiceImplTest {

    @Mock
    private LibroRepository libroRepository;

    @Mock
    private AutorRepository autorRepository;

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private EditorialRepository editorialRepository;

    @InjectMocks
    private LibroServiceImpl libroService;

    @Test
    void createThrowsWhenIsbnExists() {
        when(libroRepository.existsByIsbn("978-123")).thenReturn(true);

        LibroCreateRequest request = new LibroCreateRequest(
                "978-123",
                "Titulo",
                null,
                null,
                (short) 2020,
                "es",
                100,
                null,
                UUID.randomUUID(),
                UUID.randomUUID(),
                UUID.randomUUID()
        );

        assertThatThrownBy(() -> libroService.create(request))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("ISBN");
    }

    @Test
    void softDeleteMarksLibroInactive() {
        UUID id = UUID.randomUUID();
        Libro libro = new Libro();
        libro.setId(id);
        libro.setIsbn("978-123");
        libro.setTitulo("Titulo");
        libro.setActivo(true);

        Autor autor = new Autor();
        autor.setId(UUID.randomUUID());
        autor.setNombre("Autor");
        autor.setApellido("Apellido");
        Categoria categoria = new Categoria();
        categoria.setId(UUID.randomUUID());
        categoria.setNombre("Cat");
        Editorial editorial = new Editorial();
        editorial.setId(UUID.randomUUID());
        editorial.setNombre("Ed");

        libro.setAutor(autor);
        libro.setCategoria(categoria);
        libro.setEditorial(editorial);

        when(libroRepository.findById(id)).thenReturn(Optional.of(libro));
        when(libroRepository.findByIdWithRelations(id)).thenReturn(Optional.of(libro));

        LibroResponse response = libroService.softDelete(id);

        assertThat(response.activo()).isFalse();
        verify(libroRepository).save(any(Libro.class));
    }

    @Test
    void findByIdThrowsWhenMissing() {
        UUID id = UUID.randomUUID();
        when(libroRepository.findByIdWithRelations(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> libroService.findById(id))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
