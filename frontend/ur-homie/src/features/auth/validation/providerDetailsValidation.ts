import {
  validateMinLength,
  containsOnlySafeChars,
} from "../../../shared/utils/validationsUtils";

export interface ProviderDetails {
  education: string;
  certifications: string;
  experienceDescription: string;
}

export const validateProviderDetails = (
  data: ProviderDetails
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (
    !validateMinLength(data.education, 2) ||
    !containsOnlySafeChars(data.education)
  ) {
    errors.education = "Invalid education field.";
  }

  if (
    !validateMinLength(data.certifications, 2) ||
    !containsOnlySafeChars(data.certifications)
  ) {
    errors.certifications = "Invalid certifications.";
  }

  if (
    !validateMinLength(data.experienceDescription, 10) ||
    !containsOnlySafeChars(data.experienceDescription)
  ) {
    errors.experienceDescription = "Invalid description (min. 10 chars).";
  }

  return errors;
};