import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import {
  updateJobForPaymentSuccessUsingStripeSessionId,
  updateJobForPaymentSuccessUsingJobId,
} from "@/lib/models/Job";

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
    // Payment is successful and the subscription is created.
    case "checkout.session.completed":
      try {
        // Update the job with the Stripe session ID and activeUntil date
        const job = await updateJobForPaymentSuccessUsingStripeSessionId(
          event.data.object.id
        );

        // Retrieve the full session details from Stripe
        const session = await stripe.checkout.sessions.retrieve(
          event.data.object.id
        );

        // Update the invoice metadata with the job ID
        await stripe.invoices.update(session.invoice, {
          metadata: {
            job_id: job.id,
          },
        });

        // If a subscription is created, update its metadata with the job ID
        if (session.subscription) {
          await stripe.subscriptions.update(session.subscription, {
            metadata: {
              job_id: job.id,
            },
          });
        }
      } catch (error) {
        console.error("Error updating job:", error);
        return new NextResponse("Error occurred", { status: 400 });
      }
      break;

    // Continue to provision the subscription as payments continue to be made.
    case "invoice.paid":
      try {
        if (event.data.object.subscription) {
          // Retrieve the subscription details
          const subscription = await stripe.subscriptions.retrieve(
            event.data.object.subscription
          );

          // Update the job associated with the subscription
          await updateJobForPaymentSuccessUsingJobId(
            subscription.metadata.job_id
          );
        }
      } catch (error) {
        console.error("Error processing invoice.paid event:", error);
      }
      break;

    // The payment failed or the customer does not have a valid payment method.
    case "invoice.payment_failed":
      console.log("invoice.payment_failed", event.data.object);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }

  // Return a 200 OK response to acknowledge receipt of the event
  return new Response("", { status: 200 });
}
