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
export async function createUser(
  { user_first_name, user_last_name, user_email },
  clerkUserId
) {
  try {
    // Prepare the data for created the user
    const createParams = {
      data: {
        firstName: user_first_name,
        lastName: user_last_name,
        email: user_email,
        clerkUserId,
      },
    };

    // Prepare the user data to be inserted into the database
    return await client.user.create(createParams);
  } catch (error) {
    console.error("Error creating user:", error.message, error.stack);
    throw error;
  }
}

/**
 * Asynchronously updates an existing user.
 *
 * @param {string} id - The id of the user.
 * @param {string} email - The new email address of the user.
 * @param {string} firstName - The new first name of the user.
 * @param {string} lastName - The new last name of the user.
 * @returns {Promise<Object>} A promise that resolves to the updated user.
 */
export async function updateUser(id, email, firstName, lastName) {
  try {
    // Prepare the data for updating the user
    const updateParams = {
      where: { id },
      data: { email, firstName, lastName },
    };

    // Update the user in the database
    return await client.user.update(updateParams);
  } catch (error) {
    console.error(
      `Error updating user with ID ${id}:`,
      error.message,
      error.stack
    );
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
    // Prepare the data for updating the user's Stripe customer ID
    const updateParams = {
      where: { id: userId },
      data: { stripeUserId },
    };

    // Update the user's Stripe customer ID in the database
    const updatedUser = await client.user.update(updateParams);

    return updatedUser;
  } catch (error) {
    console.error(
      `Error updating user with ID ${userId} and Stripe customer ID ${stripeUserId}:`,
      error.message,
      error.stack
    );
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
    // Query parameters for finding the user
    const queryParams = {
      where: { clerkUserId },
      include: { organization: true },
    };

    // Find the user by Clerk user ID
    const user = await client.user.findUnique(queryParams);

    return user;
  } catch (error) {
    console.error(
      `Error finding user by Clerk user ID ${clerkUserId}:`,
      error.message,
      error.stack
    );
    throw error;
  }
}
