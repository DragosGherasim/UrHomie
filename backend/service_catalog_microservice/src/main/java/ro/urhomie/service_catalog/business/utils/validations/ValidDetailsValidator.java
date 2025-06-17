package ro.urhomie.service_catalog.business.utils.validations;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Collection;
import java.util.Map;

public class ValidDetailsValidator implements ConstraintValidator<ValidDetails, Map<String, Object>> {

    @Override
    public boolean isValid(Map<String, Object> details, ConstraintValidatorContext context) {
        if (details == null) return true;

        boolean isValid = true;

        for (Map.Entry<String, Object> entry : details.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();

            boolean invalid = false;

            if (value instanceof String str && str.trim().isEmpty()) {
                invalid = true;
            } else if (value instanceof Collection<?> coll && coll.isEmpty()) {
                invalid = true;
            }

            if (invalid) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate(
                        toFriendlyLabel(key) + " cannot be empty."
                ).addPropertyNode(key).addConstraintViolation();

                isValid = false;
            }
        }

        return isValid;
    }

    private String toFriendlyLabel(String rawKey) {
        String[] parts = rawKey.split("_");
        StringBuilder builder = new StringBuilder();
        for (String part : parts) {
            if (!part.isEmpty()) {
                builder.append(Character.toUpperCase(part.charAt(0)));
                if (part.length() > 1) {
                    builder.append(part.substring(1));
                }
                builder.append(" ");
            }
        }
        return builder.toString().trim();
    }
}