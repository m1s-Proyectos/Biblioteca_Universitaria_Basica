package com.biblioteca.api.service;

import com.biblioteca.api.model.dto.AutorSummaryResponse;
import com.biblioteca.api.model.dto.CategoriaSummaryResponse;
import com.biblioteca.api.model.dto.EditorialSummaryResponse;

import java.util.List;

public interface CatalogoReferenciaService {

    List<AutorSummaryResponse> listAutoresActivos();

    List<CategoriaSummaryResponse> listCategoriasActivas();

    List<EditorialSummaryResponse> listEditorialesActivas();
}
