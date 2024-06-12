import { Webhook } from "svix";
import { headers } from "next/headers";
import { StatusCodes } from "http-status-codes";

import {
  createUser,
  updateUser,
  findUserByClerkUserId,
} from "@/lib/models/User";
import { updateStripeCustomer } from "@/lib/payments/stripe";

/**
 * Handles incoming POST requests for Clerk webhooks.
 *
 * @param {Request} req - The incoming HTTP request.
 * @returns {Promise<Response>} The response to be sent back.
 */
export async function POST(req) {
  try {
    // Fetch the webhook secret from environment variables
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error(
        "Please add the WEBHOOK_SECRET from Clerk Dashboard to your environment variables."
      );
    }

    // Extract and validate headers from the incoming request
    const { svixId, svixTimestamp, svixSignature } = getSvixHeaders();

    // Extract and verify the payload
    const payload = await req.json();
    const event = verifyWebhookEvent(
      payload,
      svixId,
      svixTimestamp,
      svixSignature,
      WEBHOOK_SECRET
    );

    // Handle the webhook event based on its type
    switch (event.type) {
      case "user.created":
        await handleUserCreated(event);
        break;
      case "user.updated":
        await handleUserUpdated(event);
        break;
    }

    return new Response("", { status: StatusCodes.OK });
  } catch (err) {
    console.error("Error handling webhook:", err);
    return new Response(`Webhook Error: ${err.message}`, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}

/**
 * Extracts and validates the necessary Svix headers.
 *
 * @returns {Object} An object containing the Svix headers.
 * @throws {Error} If any required Svix header is missing.
 */
function getSvixHeaders() {
  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    throw new Error("Error occurred -- missing svix headers");
  }

  return { svixId, svixTimestamp, svixSignature };
}

/**
 * Verifies the webhook event using the Svix library.
 *
 * @param {Object} payload - The payload of the webhook event.
 * @param {string} svixId - The Svix ID header.
 * @param {string} svixTimestamp - The Svix timestamp header.
 * @param {string} svixSignature - The Svix signature header.
 * @param {string} secret - The webhook secret.
 * @returns {Object} The verified webhook event.
 * @throws {Error} If the event verification fails.
 */
function verifyWebhookEvent(
  payload,
  svixId,
  svixTimestamp,
  svixSignature,
  secret
) {
  const body = JSON.stringify(payload);
  const webhook = new Webhook(secret);

  return webhook.verify(body, {
    "svix-id": svixId,
    "svix-timestamp": svixTimestamp,
    "svix-signature": svixSignature,
  });
}

/**
 * Processes the user.created event from Clerk webhook.
 *
 * @param {Object} event - The Clerk webhook event containing user data.
 * @returns {Promise<void>}
 */
async function handleUserCreated(event) {
  // Destructure the necessary user data from the event
  const {
    id: clerkUserId,
    first_name: firstName,
    last_name: lastName,
    email_addresses: emailAddresses,
  } = event.data;

  try {
    // Check if the user already exists in the database
    const existingUser = await findUserByClerkUserId(clerkUserId);

    if (!existingUser) {
      // Create a new user in the database if not existing
      await createUser(
        {
          user_first_name: firstName,
          user_last_name: lastName,
          user_email: emailAddresses[0].email_address,
        },
        clerkUserId
      );

      console.log("Saved Clerk user with Clerk user ID:", clerkUserId);
    } else {
      console.log("User already exists with Clerk user ID:", clerkUserId);
    }
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error handling user.created event:", error);
  }
}

/**
 * Processes the user.updated event from Clerk webhook.
 *
 * @param {Object} event - The Clerk webhook event containing user data.
 * @returns {Promise<void>}
 */
async function handleUserUpdated(event) {
  // Destructure the necessary user data from the event
  const {
    id: clerkUserId,
    first_name: firstName,
    last_name: lastName,
    email_addresses: emailAddresses,
  } = event.data;

  try {
    // Check if the user already exists in the database
    const existingUser = await findUserByClerkUserId(clerkUserId);

    if (existingUser.stripeUserId) {
      // Update the user's information in Stripe
      await updateStripeCustomer(
        existingUser.stripeUserId,
        emailAddresses[0].email_address,
        firstName,
        lastName
      );

      console.log(
        "Updated Stripe user with updated Clerk information:",
        clerkUserId
      );
    }

    // Update the user's information in the database
    await updateUser(
      existingUser.id,
      emailAddresses[0].email_address,
      firstName,
      lastName
    );

    console.log("Updated user with updated Clerk information:", clerkUserId);
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error handling user.updated event:", error);
  }
}
