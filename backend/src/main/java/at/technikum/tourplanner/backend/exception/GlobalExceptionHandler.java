package at.technikum.tourplanner.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Übersetzt Service-Exception in HTTP 400 Bad Request
    @ExceptionHandler(LocationNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleLocationNotFound(LocationNotFoundException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    // Übersetzt Service-Exception in HTTP 404 Not Found
    @ExceptionHandler(TourNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleTourNotFound(TourNotFoundException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
}