package ro.urhomie.service_catalog.business.utils.validations;

import java.lang.reflect.Field;
import java.util.LinkedHashMap;
import java.util.Map;

public interface PatchableDto {

    default Map<String, Object> toFieldMap() {
        Map<String, Object> map = new LinkedHashMap<>();
        for (Field field : this.getClass().getDeclaredFields()) {
            field.setAccessible(true);
            try {
                Object value = field.get(this);
                if (value != null) {
                    map.put(field.getName(), value);
                }
            } catch (IllegalAccessException ignored) {}
        }
        return map;
    }
}
