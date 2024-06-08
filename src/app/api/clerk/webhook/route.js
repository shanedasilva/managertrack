import { Webhook } from "svix";
import { headers } from "next/headers";
import { createUser, findUserByClerkUserId } from "@/lib/models/User";

/**
 * Handles incoming POST requests for Clerk webhooks.
 *
 * @param {Request} req - The incoming HTTP request.
 * @returns {Promise<Response>} The response to be sent back.
 */
export async function POST(req) {
  // Fetch the webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  // Validate if the webhook secret is provided
  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add the WEBHOOK_SECRET from Clerk Dashboard to your environment variables."
    );
  }

  // Extract headers from the incoming request
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Validate if all required headers are present
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- missing svix headers", {
      status: 400,
    });
  }

  // Extract body payload
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const webhook = new Webhook(WEBHOOK_SECRET);

  let event = null;

  // Verify the payload with the headers
  try {
    event = webhook.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);

    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Process the payload based on the event type
  const { id, first_name, last_name, email_addresses } = event.data;
  console.log(`Received webhook with ID ${id} and type ${event.type}`);

  if (event.type === "user.created") {
    const existingUser = await findUserByClerkUserId(id);

    // If the user doesn't exist, create a new user
    if (!existingUser) {
      await createUser(
        {
          user_first_name: first_name,
          user_last_name: last_name,
          user_email: email_addresses[0].email_address,
        },
        id
      );
    }

    console.log("Saved Clerk user with Clerk user ID:", event.data.id);
  }

  return new Response("", { status: 200 });
}
