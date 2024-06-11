import { Webhook } from "svix";
import { headers } from "next/headers";
import { StatusCodes } from "http-status-codes";

import { createUser, findUserByClerkUserId } from "@/lib/models/User";

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
 * Processes the user.created event.
 *
 * @param {Object} event - The Clerk webhook event.
 */
async function handleUserCreated(event) {
  const { id, first_name, last_name, email_addresses } = event.data;
  const existingUser = await findUserByClerkUserId(id);

  if (!existingUser) {
    await createUser(
      {
        user_first_name: first_name,
        user_last_name: last_name,
        user_email: email_addresses[0].email_address,
      },
      id
    );

    console.log("Saved Clerk user with Clerk user ID:", id);
  }
}
