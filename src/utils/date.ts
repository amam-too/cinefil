import { format, isValid } from "date-fns";
import { fr } from "date-fns/locale/fr";

/**
 * Output: "mercredi 9 octobre 2024"
 * @param date
 */
export const getHumanReadableDate = (
  date: string | null | undefined,
): string => {
  const parsedDate = new Date(date ?? ""); // Fallback to empty string if null or undefined.
  if (!isValid(parsedDate)) {
    console.error(`Invalid date: ${date}`);
    return "Date invalide"; // Fallback message in French.
  }
  return format(parsedDate, "EEEE d MMMM yyyy", { locale: fr });
};

/**
 * Output: "09/10/2024"
 * @param date
 */
export const getShortHumanReadableDate = (
  date: string | null | undefined,
): string => {
  const parsedDate = new Date(date ?? ""); // Fallback to empty string if null or undefined.
  if (!isValid(parsedDate)) {
    console.error(`Invalid date: ${date}`);
    return "Date invalide"; // Fallback message in French.
  }
  return format(parsedDate, "P", { locale: fr });
};

/**
 * Output: "2024"
 * @param date
 */
export const getYearOnly = (date: string | null | undefined): string => {
  const parsedDate = new Date(date ?? ""); // Fallback to empty string if null or undefined.
  if (!isValid(parsedDate)) {
    console.error(`Invalid date: ${date}`);
    return "Date invalide"; // Fallback message in French.
  }
  return format(parsedDate, "yyyy");
};
