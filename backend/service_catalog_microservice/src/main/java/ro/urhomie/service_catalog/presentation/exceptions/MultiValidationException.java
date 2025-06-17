package ro.urhomie.service_catalog.presentation.exceptions;

import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
public class MultiValidationException extends RuntimeException {
    private final Map<String, List<String>> errors;

    public MultiValidationException(Map<String, List<String>> errors) {
        super("Invalid inputs");
        this.errors = errors;
    }
}