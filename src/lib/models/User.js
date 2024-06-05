import client from "@/lib/database/client";

/**
 * Asynchronously creates a user in the database.
 *
 * @param {string} firstName - The first name of the user.
 * @param {string} lastName - The last name of the user.
 * @param {string} email - The email of the user.
 * @returns {Promise<Object>} A promise that resolves to the created user.
 */
export async function createUser(firstName, lastName, email) {
  return await client.user.create({
    data: {
      firstName,
      lastName,
      email,
    },
  });
}

/**
 * Asynchronously updates a user with a Stripe customer ID using their ID.
 *
 * @param {number} userId - The ID of the user to be updated.
 * @param {string} stripeUserId - The Stripe customer ID to be associated with the user.
 * @returns {Promise<Object>} A promise that resolves to the updated user.
 */
export async function updateUserWithStripeCustomerIdUsingId(
  userId,
  stripeUserId
) {
  return await client.user.update({
    where: {
      id: userId,
    },
    data: {
      stripeUserId: stripeUserId,
    },
  });
}
