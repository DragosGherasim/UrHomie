export function buildPatchPayload(
  original: Record<string, any>,
  current: Record<string, any>
): Record<string, any> {
  const payload: Record<string, any> = {};

  for (const [key, value] of Object.entries(current)) {
    const originalValue = original[key];

    if (
      value !== originalValue &&
      !(typeof value === "string" && value.trim() === "" && originalValue?.trim?.() === "")
    ) {
      payload[key] = value;
    }
  }

  return payload;
}
