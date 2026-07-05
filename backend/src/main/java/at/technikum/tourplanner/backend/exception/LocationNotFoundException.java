package at.technikum.tourplanner.backend.exception;

// Reine Business-Exception
public class LocationNotFoundException extends RuntimeException {
    public LocationNotFoundException(String message) {
        super(message);
    }
}