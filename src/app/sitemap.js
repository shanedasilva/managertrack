import { getAllJobSlugsWithModifyTime } from "@/lib/models/Job";

/**
 * Generates a sitemap for the application.
 *
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of sitemap entries.
 */
export default async function sitemap() {
  try {
    // Fetch all job slugs with their last modified time from the database
    const jobs = await getAllJobSlugsWithModifyTime();

    // Define the base application URL from the environment variable
    const baseAppUrl = process.env.NEXT_PUBLIC_BASE_APP_URL;

    // Get the current date to use as the last modified date for static pages
    const currentDate = new Date();

    // Define default static pages for the sitemap
    const defaultPages = [
      {
        url: `${baseAppUrl}`,
        lastModified: currentDate,
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${baseAppUrl}/jobs/new`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.9,
      },
    ];

    // Map job slugs to their respective sitemap entries
    const jobPages = jobs.map((job) => ({
      url: `${baseAppUrl}/jobs/${jobs.industry.slug}/${job.slug}`,
      lastModified: job.updatedAt,
      changeFrequency: "daily",
      priority: 0.8,
    }));

    // Combine default pages and job pages into the final sitemap array
    return [...defaultPages, ...jobPages];
  } catch (error) {
    console.error("Error generating sitemap: ", error);
    throw error;
  }
}
