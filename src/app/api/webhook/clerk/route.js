import { Webhook } from "svix";
import { headers } from "next/headers";

import { CreateUser } from "../../../../server/models/User";

export async function POST(req) {
  // Fetch the webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  // Validate if the webhook secret is provided
  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add the WEBHOOK_SECRET from Clerk Dashboard to your environment variables."
    );
  }

  // Extract headers
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

  // Process the payload
  const { id } = event.data;
  const eventType = event.type;

  console.log(`Received webhook with ID ${id} and type ${eventType}`);
  console.log("Webhook body:", body);

  if (event.type === "user.created") {
    await CreateUser(
      event.data.external_id,
      event.data.first_name,
      event.data.last_name,
      event.data.email_addresses[0].email_address
    );

    console.log("userId:", event.data.id);
  }

  return new Response("", { status: 200 });
}
