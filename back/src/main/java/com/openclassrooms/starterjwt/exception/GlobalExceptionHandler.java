package com.openclassrooms.starterjwt.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

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
     * Gère toutes les autres exceptions NumberFormatException spécifiquement.
     * Détermine le code HTTP approprié.
     * 
     * @param ex L'exception levée
     * @return Une réponse HTTP avec le code de statut approprié
     */
    @ExceptionHandler(NumberFormatException.class)
    public ResponseEntity<?> handleGlobalException(NumberFormatException ex) {
        // return buildErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
