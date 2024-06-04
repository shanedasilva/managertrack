import client from "../database/client";

/**
 * Create a user from the database asynchronously.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to the created user
 */
export async function GetFeaturedOrganizations() {
  return await client.organization.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          Job: { where: { status: "OPEN" } },
        },
      },
    },
  });
}
