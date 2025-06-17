package ro.urhomie.service_catalog.business.utils.validations;

import org.springframework.stereotype.Component;
import ro.urhomie.service_catalog.business.dtos.provided_service.PatchProvidedServiceDto;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class PatchValidator {

    public Map<String, List<String>> validate(PatchProvidedServiceDto dto) {
        Map<String, List<String>> errors = new HashMap<>();

        dto.toFieldMap().forEach((field, value) -> {
            if (value instanceof String str && str.trim().isEmpty()) {
                errors.put(field, List.of(formatLabel(field) + " cannot be empty."));
            }

            if (field.equals("basePrice") && value instanceof String strVal) {
                if (strVal.trim().isEmpty()) {
                    errors.put(field, List.of("Base price cannot be empty."));
                } else {
                    try {
                        double price = Double.parseDouble(strVal);
                        if (price <= 0) {
                            errors.put(field, List.of("Base price must be greater than 0."));
                        }
                    } catch (NumberFormatException e) {
                        errors.put(field, List.of("Base price must be a valid number."));
                    }
                }
            }

            if (field.equals("details") && value instanceof Map<?, ?> detailsMap) {
                for (Map.Entry<?, ?> entry : detailsMap.entrySet()) {
                    if (entry.getKey() instanceof String key) {
                        Object val = entry.getValue();

                        boolean invalid = (val instanceof String s && s.trim().isEmpty())
                                || (val instanceof Collection<?> c && c.isEmpty());

                        if (invalid) {
                            errors.put("details." + key, List.of(formatLabel(key) + " cannot be empty."));
                        }
                    }
                }
            }
        });

        return errors;
    }

    private String formatLabel(String key) {
        return Arrays.stream(key.split("_"))
                .map(part -> part.substring(0, 1).toUpperCase() + part.substring(1))
                .collect(Collectors.joining(" "));
    }
}
