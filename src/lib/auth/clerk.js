import { createClerkClient } from "@clerk/clerk-sdk-node";

/**
 * Creates a Clerk client instance using the secret key from environment variables.
 */
export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

/**
 * Creates a new user in Clerk.
 *
 * @param {string} firstName - The first name of the user.
 * @param {string} lastName - The last name of the user.
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the user.
 * @returns {Promise<Object>} The newly created user object.
 * @throws {Error} If user creation fails.
 */
export async function createClerkUser(firstName, lastName, email, password) {
  try {
    const newUser = await clerkClient.users.createUser({
      firstName: firstName,
      lastName: lastName,
      emailAddress: [email],
      password: password,
    });

    return newUser;
  } catch (error) {
    throw new Error(`Failed to create clerk user: ${error.message}`);
  }
}
