import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { StatusCodes } from "http-status-codes";

import {
  createStripeWebhookEvent,
  getStripeSession,
  updateStripeInvoiceWithJobIdMetadata,
  getStripeSubscription,
  updateStripeSubscriptionWithJobIdMetadata,
} from "@/lib/payments/stripe";

import {
  updateJobForPaymentSuccessUsingStripeSessionId,
  updateJobForPaymentSuccessUsingJobId,
} from "@/lib/models/Job";

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
    // Verify the webhook event is using Stripe's SDK
    event = createStripeWebhookEvent(body, signature);
  } catch (err) {
    // Return an error response if the event verification fails
    return new NextResponse(`Webhook Error: ${err.message}`, {
      status: StatusCodes.BAD_REQUEST,
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
        const session = await getStripeSession(event.data.object.id);
        // Update the invoice metadata with the job ID
        await updateStripeInvoiceWithJobIdMetadata(session.invoice, job.id);

        // If a subscription is created, update its metadata with the job ID
        if (session.subscription) {
          await updateStripeSubscriptionWithJobIdMetadata(
            session.subscription,
            job.id
          );
        }
      } catch (error) {
        console.error("Error updating job:", error);

        return new NextResponse("Error occurred", {
          status: StatusCodes.BAD_REQUEST,
        });
      }
      break;

    // Continue to provision the subscription as payments continue to be made.
    case "invoice.paid":
      try {
        if (event.data.object.subscription) {
          // Retrieve the subscription details
          const subscription = await getStripeSubscription(
            event.data.object.subscription
          );
          // Update the job associated with the subscription
          await updateJobForPaymentSuccessUsingJobId(
            subscription.metadata.jobId
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
  return new Response("", { status: StatusCodes.OK });
}
