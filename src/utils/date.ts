/**
 * Formats a date string to a consistent format that works the same on server and client
 * @param dateString - ISO date string or date string
 * @returns Formatted date string in MM/DD/YYYY format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};
