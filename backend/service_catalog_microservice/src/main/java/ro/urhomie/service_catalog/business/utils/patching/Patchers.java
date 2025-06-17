package ro.urhomie.service_catalog.business.utils.patching;

import org.springframework.stereotype.Component;
import ro.urhomie.service_catalog.business.dtos.provided_service.PatchProvidedServiceDto;
import ro.urhomie.service_catalog.business.dtos.provided_service.ProvidedServiceDto;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

@Component
public class Patchers {

    public static void patcherProvidedService(ProvidedServiceDto serviceDto, PatchProvidedServiceDto patchServiceDto) {
        Field[] sourceFields = PatchProvidedServiceDto.class.getDeclaredFields();

        for (Field sourceField : sourceFields) {
            sourceField.setAccessible(true);
            Object value;

            try {
                value = sourceField.get(patchServiceDto);
            } catch (IllegalAccessException e) {
                throw new RuntimeException(e);
            }

            if (value != null) {
                try {
                    Field targetField = ProvidedServiceDto.class.getDeclaredField(sourceField.getName());
                    targetField.setAccessible(true);

                    if (targetField.getName().equals("basePrice") && value instanceof String strVal) {
                        if (!strVal.trim().isEmpty()) {
                            try {
                                value = Double.parseDouble(strVal);
                            } catch (NumberFormatException e) {
                                throw new IllegalArgumentException("Invalid number format for basePrice: " + strVal);
                            }
                        } else {
                            continue;
                        }
                    }

                    if (targetField.getName().equals("details") &&
                            value instanceof Map<?, ?> patchDetails &&
                            targetField.get(serviceDto) instanceof Map<?, ?> existingDetails) {

                        Map<String, Object> merged = new HashMap<>((Map<String, Object>) existingDetails);
                        for (Map.Entry<?, ?> entry : patchDetails.entrySet()) {
                            if (entry.getKey() instanceof String key) {
                                merged.put(key, entry.getValue());
                            }
                        }

                        targetField.set(serviceDto, merged);
                        continue;
                    }

                    if (targetField.getType().isAssignableFrom(value.getClass())) {
                        targetField.set(serviceDto, value);
                    } else {
                        throw new IllegalArgumentException("Type mismatch for field: " + targetField.getName());
                    }
                } catch (NoSuchFieldException ignored) {
                } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                } finally {
                    sourceField.setAccessible(false);
                }
            }
        }
    }
}
