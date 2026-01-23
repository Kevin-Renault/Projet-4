package com.openclassrooms.starterjwt.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
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
     * Gère les autres exceptions spécifiquement.
     * Détermine le code HTTP approprié.
     * 
     * @param ex L'exception levée
     * @return Une réponse HTTP avec le code de statut approprié
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception ex) {
        System.out.println("Global exception handler caught: " + ex.getClass().getName());
        if (ex instanceof NumberFormatException || ex instanceof BadRequestException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } else if (ex instanceof BadCredentialsException) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } else if (ex instanceof NotAuthorizedException) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } else if (ex instanceof NotFoundException) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
