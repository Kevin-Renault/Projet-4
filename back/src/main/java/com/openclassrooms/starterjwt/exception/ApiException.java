package com.openclassrooms.starterjwt.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Exception de base pour toutes les exceptions métier de l'API.
 * Permet d'associer un code de statut HTTP à chaque exception.
 * 
 * @author Kévin Renault
 */
@Getter
public class ApiException extends RuntimeException {

    /**
     * Message décrivant l'erreur.
     */
    private final String message;

    /**
     * Statut HTTP associé à cette exception.
     */
    private final HttpStatus httpStatus;

    /**
     * Constructeur de l'exception API.
     * 
     * @param message    Message décrivant l'erreur
     * @param httpStatus Code de statut HTTP à retourner
     */
    public ApiException(String message, HttpStatus httpStatus) {
        super(message);
        this.message = message;
        this.httpStatus = httpStatus;
    }

    /**
     * Retourne le code de statut HTTP sous forme d'entier.
     * 
     * @return Le code de statut (ex: 404, 500)
     */
    public int getStatusCode() {
        return httpStatus.value();
    }
}
