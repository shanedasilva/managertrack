import client from "../database/client";

/**
 * Create a user from the database asynchronously.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to the created user
 */
export async function CreateUser(firstName, lastName, email) {
  return await client.user.create({
    data: {
      firstName,
      lastName,
      email,
    },
  });
}

export async function UpdateUserWithStripeCustomerIdUsingId(
  userId,
  stripeUserId
) {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      stripeUserId: stripeUserId,
    },
  });
}
