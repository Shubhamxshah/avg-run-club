export function formatAuthError(error: { message?: string } | null) {
  if (!error?.message) {
    return "Something went wrong. Please try again.";
  }

  return error.message;
}
