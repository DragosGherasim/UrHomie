import {
  validateEmail,
  validatePhone,
  containsOnlySafeChars,
} from "./validationsUtils";
import { GeneralFormData } from "../../types/forms";

export const validateGeneralForm = (
  data: GeneralFormData,
  role: string
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!role) errors["role"] = "Please select a role.";
  if (!validateEmail(data.email)) errors["email"] = "Invalid email.";
  if (!data.password || data.password.length < 6)
    errors["password"] = "Password must be at least 6 characters.";

  ["firstName", "lastName", "country", "city", "address"].forEach((key) => {
    const value = data[key as keyof GeneralFormData];
    if (!value || !containsOnlySafeChars(value)) {
      errors[key] = "Invalid input. Avoid special characters.";
    }
  });

  if (!validatePhone(data.phoneNumber))
    errors["phoneNumber"] = "Invalid phone number.";

  return errors;
};
