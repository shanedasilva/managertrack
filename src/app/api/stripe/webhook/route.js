import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Initialize the Stripe client with the secret key and API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// Retrieve the Stripe webhook secret from environment variables
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Handles POST requests for Stripe webhooks.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<Response>} The response to be sent back.
 */
export async function POST(request) {
  // Read the raw body text from the request
  const body = await request.text();

  // Extract the Stripe signature from the request headers
  const headersList = headers();
  const signature = headersList.get("stripe-signature");
  let event;

  try {
    // Verify the webhook event using Stripe's SDK
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      stripeWebhookSecret
    );
  } catch (err) {
    // Return an error response if the event verification fails
    return new NextResponse(`Webhook Error: ${err.message}`, {
      status: 400,
    });
  }

  // Handle the webhook event based on its type
  switch (event.type) {
    case "invoice.paid":
      console.log("invoice.paid", event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 OK response to acknowledge receipt of the event
  return new Response("", { status: 200 });
}
