package ro.urhomie.service_catalog.presentation.exceptions;

public class InvalidReferenceException extends RuntimeException {
    public InvalidReferenceException(String message) {
        super(message);
    }
}
