/**
 * Converts a job post title into a URL slug limited to 10 words and appends a unique hash.
 *
 * @param {string} title - The job post title to be converted.
 * @returns {string} - The URL slug with a unique hash.
 */
export function convertToSlug(title) {
  const generateUniqueHash = () => {
    // Get last 4 digits of the current timestamp
    const timestamp = Date.now().toString().slice(-4);
    // Generate a 4-digit random number
    const randomNum = Math.floor(1000 + Math.random() * 9000).toString();
    // Combine them to form the unique hash
    return timestamp + randomNum;
  };

  const slug = title
    .toLowerCase() // Convert to lowercase
    .trim() // Trim leading and trailing whitespace
    .replace(/[^\w\s-]/g, "") // Remove all non-word characters except spaces and hyphens
    .split(/\s+/) // Split the title into words
    .slice(0, 5) // Limit to the first 5 words
    .join(" ") // Rejoin the words into a string
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading or trailing hyphens

  const uniqueHash = generateUniqueHash();

  return `${slug}-${uniqueHash}`;
}
