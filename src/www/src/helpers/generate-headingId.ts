export const generateHeadingId = (input: string): string => {
  return input
    ?.toLowerCase()
    ?.replace(/[^a-z0-9\s]+/g, "") // Replace all non-alphanumeric characters with an empty string
    ?.replace(/\s+/g, "-"); // Replace all spaces with hyphens
};
