import client from "@/lib/database/client";

/**
 * Asynchronously retrieves featured organizations from the database.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to the featured organizations.
 */
export async function getFeaturedOrganizations() {
  return await client.organization.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          jobs: { where: { status: "OPEN" } },
        },
      },
    },
    take: 4,
  });
}

/**
 * Asynchronously creates a new organization.
 *
 * @param {Object} data - Data object containing information about the organization.
 * @returns {Promise<Object>} A promise that resolves to an object containing the created organization.
 */
export async function createOrganization(form) {
  try {
    return await client.organization.create({
      data: {
        name: form.organization_name,
        website: form.organization_website,
      },
    });
  } catch (error) {
    console.error("Error creating organization: ", error);
  }
}
