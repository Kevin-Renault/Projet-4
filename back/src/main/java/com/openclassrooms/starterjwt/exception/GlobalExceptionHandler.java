package com.openclassrooms.starterjwt.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.openclassrooms.starterjwt.dto.ErrorResponse;

import java.time.LocalDateTime;

/**
 * Gestionnaire global des exceptions de l'application.
 * Intercepte et formate les exceptions pour retourner des réponses d'erreur
 * standardisées.
 * 
 * @author Kévin Renault
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Gère toutes les autres exceptions non interceptées spécifiquement.
     * Détermine le code HTTP approprié selon le type d'exception.
     * 
     * @param ex L'exception levée
     * @return Une réponse HTTP avec le code de statut approprié
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex) {
        HttpStatus status;
        if (ex instanceof ApiException exception) {
            status = exception.getHttpStatus();
        } else if (ex instanceof NumberFormatException) {
            status = HttpStatus.BAD_REQUEST;
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return buildErrorResponse(status, ex.getMessage());
    }

    private ResponseEntity<ErrorResponse> buildErrorResponse(HttpStatus statusCode,
            String errorMessage) {
        ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now(),
                statusCode.value(),
                errorMessage);

        return ResponseEntity
                .status(statusCode)
                .body(errorResponse);
    }
}
