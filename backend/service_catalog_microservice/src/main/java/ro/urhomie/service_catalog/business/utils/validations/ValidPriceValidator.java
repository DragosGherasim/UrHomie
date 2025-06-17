package ro.urhomie.service_catalog.business.utils.validations;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ValidPriceValidator implements ConstraintValidator<ValidPrice, String> {

    private static final String PRICE_PATTERN = "^\\d+(\\.\\d{1,2})?$";

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.trim().isEmpty()) return false;

        if (!value.matches(PRICE_PATTERN)) return false;

        try {
            double price = Double.parseDouble(value);
            return price > 0;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}
