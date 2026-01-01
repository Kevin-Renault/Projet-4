package com.openclassrooms.starterjwt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO (Data Transfer Object) représentant une réponse d'erreur de l'API.
 * Utilisé pour retourner des erreurs formatées au client.
 * 
 * @author Kévin Renault
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    /**
     * Timestamp de l'erreur.
     */
    private LocalDateTime timestamp;

    /**
     * Code de statut HTTP.
     */
    private int status;

    /**
     * Message décrivant l'erreur.
     */
    private String message;
}
