import client from "@/lib/database/client";
import { convertToSlug } from "@/lib/utils/string";
import { STATUS_OPEN } from "@/lib/models/Job";

/**
 * Asynchronously retrieves featured organizations from the database.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of featured organizations.
 */
export async function getFeaturedOrganizations() {
  return await client.organization.findMany({
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
  });
}

/**
 * Asynchronously creates a new organization.
 *
 * @param {Object} form - Form object containing information about the organization.
 * @param {string} form.organization_name - The name of the organization.
 * @param {string} form.organization_website - The website of the organization.
 * @returns {Promise<Object>} A promise that resolves to the created organization object.
 * @throws {Error} Throws an error if organization creation fails.
 */
export async function createOrganization(form) {
  try {
    return await client.organization.create({
      data: {
        name: form.organization_name,
        slug: convertToSlug(form.organization_name),
        website: form.organization_website,
      },
    });
  } catch (error) {
    console.error("Error creating organization: ", error);
    throw error;
  }
}
