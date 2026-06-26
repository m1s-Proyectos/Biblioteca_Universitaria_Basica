package com.biblioteca.api.service;

import com.biblioteca.api.model.dto.LibroCreateRequest;
import com.biblioteca.api.model.dto.LibroResponse;
import com.biblioteca.api.model.dto.LibroUpdateRequest;
import com.biblioteca.api.model.dto.PageResponse;
import com.biblioteca.api.service.dto.LibroFilterCriteria;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface LibroService {

    PageResponse<LibroResponse> findAll(LibroFilterCriteria filter, Pageable pageable);

    LibroResponse findById(UUID id);

    LibroResponse create(LibroCreateRequest request);

    LibroResponse update(UUID id, LibroUpdateRequest request);

    LibroResponse softDelete(UUID id);
}
