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
    // Query parameters for creating the organization-user association
    const data = {
      organizationId,
      userId,
    };

    // Create the organization-user association
    const organizationUser = await client.organizationUser.create({ data });

    return organizationUser;
  } catch (error) {
    console.error(
      `Error creating organization user association for organization ID ${organizationId} and user ID ${userId}:`,
      error.message,
      error.stack
    );
    throw error;
  }
}
