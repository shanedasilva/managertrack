/**
 * Generates the robots.txt configuration for the application.
 *
 * @returns {Object} - An object representing the robots.txt configuration.
 */
export default function robots() {
  // Define the base application URL from the environment variable
  const baseAppUrl = process.env.NEXT_PUBLIC_BASE_APP_URL;

  return {
    // Rules for web crawlers
    rules: {
      // Allow all web crawlers to access all pages
      allow: ["/"],
      // Disallow web crawlers from accessing search results and admin pages
      disallow: ["/search?q=", "/admin/"],
      // Apply these rules to all user agents (web crawlers)
      userAgent: "*",
    },
    // Specify the location of the sitemap
    sitemap: [`${baseAppUrl}/sitemap.xml`],
  };
}
