package at.technikum.tourplanner.backend.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Übersetzt Service-Exception in HTTP 400 Bad Request
    @ExceptionHandler(LocationNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleLocationNotFound(LocationNotFoundException ex) {
        log.warn("Routing-Fehler: {}", ex.getMessage());

        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    // Übersetzt Service-Exception in HTTP 404 Not Found
    @ExceptionHandler(TourNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleTourNotFound(TourNotFoundException ex) {
        log.error("Datenbank-Fehler: {}", ex.getMessage());

        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleInvalidCredentials(InvalidCredentialsException ex) {
        log.warn("Fehlgeschlagener Login-Versuch: {}", ex.getMessage());

        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", ex.getMessage());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, String>> handleMaxSizeException(MaxUploadSizeExceededException exc) {
        log.warn("Datei-Upload blockiert: Datei war größer als das 5MB Limit.");

        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Die Bilddatei ist zu groß! Maximal erlaubt sind 5 MB.");

        // HTTP 413
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(errorResponse);
    }
}