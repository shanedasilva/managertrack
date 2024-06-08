import client from "@/lib/database/client";

/**
 * Asynchronously creates a new organization user association.
 *
 * @param {number} organizationId - The ID of the organization.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Object>} A promise that resolves to the created organization user object.
 * @throws {Error} Throws an error if the association creation fails.
 */
export async function createOrganizationUser(organizationId, userId) {
  try {
    return await client.organizationUser.create({
      data: {
        organizationId: organizationId,
        userId: userId,
      },
    });
  } catch (error) {
    console.error("Error creating organization user association: ", error);
    throw error;
  }
}
