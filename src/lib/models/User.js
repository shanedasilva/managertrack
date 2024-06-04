import client from "../database/client";

/**
 * Create a user from the database asynchronously.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to the created user
 */
export async function CreateUser(externalId, firstName, lastName, email) {
  return await client.user.create({
    data: {
      externalId,
      firstName,
      lastName,
      email,
    },
  });
}
