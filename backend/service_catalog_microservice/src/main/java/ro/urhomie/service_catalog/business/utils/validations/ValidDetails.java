package ro.urhomie.service_catalog.business.utils.validations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = ValidDetailsValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidDetails {
    String message() default "Invalid details: some fields are missing or null.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
