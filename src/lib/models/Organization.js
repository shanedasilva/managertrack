import client from "@/lib/database/client";
import { convertToSlug } from "@/lib/utils/string";
import { STATUS_OPEN } from "@/lib/models/Job";
import { createSearchObject } from "@/lib/search/client";

/**
 * Asynchronously retrieves featured organizations from the database.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of featured organizations.
 */
/**
 * Retrieves a list of up to 4 featured organizations with their job counts.
 *
 * @returns {Promise<Array>} - An array of featured organizations with selected fields and job counts.
 * @throws {Error} - Throws an error if the query operation fails.
 */
export async function getFeaturedOrganizations() {
  try {
    // Query parameters for finding the organizations
    const queryParams = {
      where: {
        featured: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            jobs: { where: { status: STATUS_OPEN } },
          },
        },
      },
      take: 4,
    };

    const featuredOrganizations = await client.organization.findMany(
      queryParams
    );

    return featuredOrganizations;
  } catch (error) {
    console.error(
      "Error retrieving featured organizations: ",
      error.message,
      error.stack
    );
    throw error;
  }
}

/**
 * Creates a new organization and optionally indexes it for search.
 *
 * @param {Object} form - The form data containing organization details.
 * @returns {Promise<Object>} - The newly created organization.
 * @throws {Error} - Throws an error if the creation process fails.
 */
export async function createOrganization(form) {
  try {
    // Prepare the data for the new organization
    const organizationData = {
      name: form.organization_name,
      websiteURL: form.organization_website,
      slug: convertToSlug(form.organization_name),
    };

    // Create the organization in the database
    const newOrganization = await client.organization.create({
      data: organizationData,
    });

    // Optionally index the organization for search
    if (process.env.SEARCH_ENABLED) {
      await createSearchObject("Organization", {
        ...newOrganization,
        objectID: newOrganization.id,
      });

      console.log(`Organization indexed for search: ${newOrganization.name}`);
    }

    return newOrganization;
  } catch (error) {
    console.error("Error creating organization:", error.message, error.stack);
    throw error;
  }
}
