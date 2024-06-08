import client from "@/lib/database/client";

/**
 * Asynchronously creates a new user.
 *
 * @param {Object} form - Form object containing information about the user.
 * @param {string} form.user_first_name - The first name of the user.
 * @param {string} form.user_last_name - The last name of the user.
 * @param {string} form.user_email - The email address of the user.
 * @param {string} clerkUserId - The Clerk user ID.
 * @returns {Promise<Object>} A promise that resolves to the created user object.
 * @throws {Error} Throws an error if user creation fails.
 */
export async function createUser(form, clerkUserId) {
  try {
    const data = {
      firstName: form.user_first_name,
      lastName: form.user_last_name,
      email: form.user_email,
      clerkUserId: clerkUserId,
    };

    return await client.user.create({
      data: data,
    });
  } catch (error) {
    console.error("Error creating user: ", error);
    throw error;
  }
}

/**
 * Asynchronously updates a user with a Stripe customer ID using their ID.
 *
 * @param {number} userId - The ID of the user to be updated.
 * @param {string} stripeUserId - The Stripe customer ID to be associated with the user.
 * @returns {Promise<Object>} A promise that resolves to the updated user object.
 * @throws {Error} Throws an error if user update fails.
 */
export async function updateUserWithStripeCustomerIdUsingId(
  userId,
  stripeUserId
) {
  try {
    return await client.user.update({
      where: {
        id: userId,
      },
      data: {
        stripeUserId: stripeUserId,
      },
    });
  } catch (error) {
    console.error("Error updating user with Stripe customer ID: ", error);
    throw error;
  }
}

/**
 * Asynchronously finds a user by their Clerk user ID.
 *
 * @param {string} clerkUserId - The Clerk user ID.
 * @returns {Promise<Object|null>} A promise that resolves to the found user object or null if no user is found.
 * @throws {Error} Throws an error if user retrieval fails.
 */
export async function findUserByClerkUserId(clerkUserId) {
  try {
    return await client.user.findUnique({
      where: {
        clerkUserId: clerkUserId,
      },
      include: {
        organization: true,
      },
    });
  } catch (error) {
    console.error("Error finding user by Clerk user ID: ", error);
    throw error;
  }
}
