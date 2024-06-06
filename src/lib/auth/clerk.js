import { createClerkClient } from "@clerk/clerk-sdk-node";

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function createClerkUser(firstName, lastName, email, password) {
  return await clerkClient.users.createUser({
    firstName: firstName,
    lastName: lastName,
    emailAddress: [email],
    password: password,
  });
}
