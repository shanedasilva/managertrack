import client from "@/lib/database/client";

/**
 * Asynchronously retrieves featured organizations from the database.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to the featured organizations.
 */
export async function createOrganizationUser(organizationId, userId) {
  return await client.organizationUser.create({
    data: {
      organizationId: organizationId,
      userId: userId,
    },
  });
}
