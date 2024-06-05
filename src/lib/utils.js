import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Concatenates and merges multiple class strings or arrays into a single class string.
 *
 * @param {...(string|string[])} inputs - Class strings or arrays to be concatenated and merged.
 * @returns {string} - Merged class string.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
