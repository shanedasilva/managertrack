import client from "@/lib/database/client";

/**
 * Asynchronously creates a new user.
 *
 * @param {Object} data - Data object containing information about the user.
 * @returns {Promise<Object>} A promise that resolves to an object containing the created user.
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
  }
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

export async function findUserByClerkUserId(clerkUserId) {
  return await client.user.findUnique({
    where: {
      clerkUserId: clerkUserId,
    },
    include: {
      organization: true,
    },
  });
}
