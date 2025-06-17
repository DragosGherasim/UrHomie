export const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
export const validatePhone = (phone: string): boolean =>
  /^\+?[0-9]{10,15}$/.test(phone);

export const validateMinLength = (value: string, min: number): boolean =>
  value.trim().length >= min;

export const containsOnlySafeChars = (value: string): boolean =>
  /^[a-zA-Z0-9\s.,-]*$/.test(value);
  