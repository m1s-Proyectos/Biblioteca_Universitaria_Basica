package com.biblioteca.api.service.impl;

import com.biblioteca.api.mapper.LibroMapper;
import com.biblioteca.api.model.dto.AutorSummaryResponse;
import com.biblioteca.api.model.dto.CategoriaSummaryResponse;
import com.biblioteca.api.model.dto.EditorialSummaryResponse;
import com.biblioteca.api.repository.AutorRepository;
import com.biblioteca.api.repository.CategoriaRepository;
import com.biblioteca.api.repository.EditorialRepository;
import com.biblioteca.api.service.CatalogoReferenciaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CatalogoReferenciaServiceImpl implements CatalogoReferenciaService {

    private final AutorRepository autorRepository;
    private final CategoriaRepository categoriaRepository;
    private final EditorialRepository editorialRepository;

    public CatalogoReferenciaServiceImpl(
            AutorRepository autorRepository,
            CategoriaRepository categoriaRepository,
            EditorialRepository editorialRepository
    ) {
        this.autorRepository = autorRepository;
        this.categoriaRepository = categoriaRepository;
        this.editorialRepository = editorialRepository;
    }

    @Override
    public List<AutorSummaryResponse> listAutoresActivos() {
        return autorRepository.findByActivoTrueOrderByApellidoAscNombreAsc().stream()
                .map(LibroMapper::toAutorSummary)
                .toList();
    }

    @Override
    public List<CategoriaSummaryResponse> listCategoriasActivas() {
        return categoriaRepository.findByActivoTrueOrderByNombreAsc().stream()
                .map(LibroMapper::toCategoriaSummary)
                .toList();
    }

    @Override
    public List<EditorialSummaryResponse> listEditorialesActivas() {
        return editorialRepository.findByActivoTrueOrderByNombreAsc().stream()
                .map(LibroMapper::toEditorialSummary)
                .toList();
    }
}
