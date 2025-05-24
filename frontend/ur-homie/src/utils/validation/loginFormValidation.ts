import { validateEmail, validateMinLength } from "./validationsUtils";

interface LoginFormData {
  email: string;
  password: string;
}

export const validateLoginForm = (data: LoginFormData): string | null => {
  if (!validateEmail(data.email)) {
    return "Invalid email";
  }

  if (!validateMinLength(data.password, 6)) {
    return "Password must be at least 6 characters";
  }

  return null;
};
