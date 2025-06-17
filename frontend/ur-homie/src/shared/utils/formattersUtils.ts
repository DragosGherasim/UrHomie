export const formatLabel = (label: string): string => {
  return label
    .replace(/[_\s]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(
      /\w\S*/g,
      (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    );
};