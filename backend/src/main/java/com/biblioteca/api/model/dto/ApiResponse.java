package com.biblioteca.api.model.dto;

public record ApiResponse<T>(T data, String message) {
}

