import { toast } from "react-hot-toast";

type ErrorType = {
  message?: string;
  _refreshFailed?: boolean;
  [key: string]: any;
};

type HandleApiErrorOptions = {
  logout: () => void;
  fallbackMessage?: string;
  knownMessages?: Record<string, string>;
  onKnown?: Record<string, () => void>;
  onDefault?: () => void;
};

export const handleApiError = (
  err: ErrorType,
  {
    logout,
    fallbackMessage = "Something went wrong.",
    knownMessages = {},
    onKnown = {},
    onDefault,
  }: HandleApiErrorOptions
) => {
  const msg = err.message || "";

  const toastMessage =
    knownMessages[msg] ||
    (msg === "unauthorized"
      ? "You must be logged in."
      : msg === "forbidden"
      ? "You are not allowed to access this resource."
      : fallbackMessage);

  const isAuthError = msg === "unauthorized" || msg === "forbidden";

  if (isAuthError && !err._refreshFailed) {
    return;
  }

  toast.error(toastMessage);

  if (msg in onKnown) {
    onKnown[msg]?.();
  } else if (onDefault) {
    onDefault();
  }

  if (isAuthError && err._refreshFailed) {
    logout();
  }
};