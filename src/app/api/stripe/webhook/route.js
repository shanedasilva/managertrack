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
  try {
    // Read the raw body text from the request
    const body = await request.text();

    // Extract the Stripe signature from the request headers
    const signature = headers().get("stripe-signature");

    // Verify the webhook event using Stripe's SDK
    const event = createStripeWebhookEvent(body, signature);

    // Handle the webhook event based on its type
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object.id);
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object.subscription);
        break;

      case "invoice.payment_failed":
        console.log("invoice.payment_failed", event.data.object);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
        break;
    }

    return new Response("", { status: StatusCodes.OK });
  } catch (err) {
    console.error("Webhook Error:", err);
    return new NextResponse(`Webhook Error: ${err.message}`, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}

/**
 * Handles the checkout.session.completed event.
 *
 * @param {string} sessionId - The ID of the Stripe session.
 */
async function handleCheckoutSessionCompleted(sessionId) {
  try {
    // Update the job with the Stripe session ID and activeUntil date
    const job = await updateJobForPaymentSuccessUsingStripeSessionId(sessionId);
    // Retrieve the full session details from Stripe
    const session = await getStripeSession(sessionId);
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
    console.error("Error handling checkout.session.completed event:", error);
    throw error;
  }
}

/**
 * Handles the invoice.paid event.
 *
 * @param {string} subscriptionId - The ID of the Stripe subscription.
 */
async function handleInvoicePaid(subscriptionId) {
  try {
    // Retrieve the subscription details
    const subscription = await getStripeSubscription(subscriptionId);
    // Update the job associated with the subscription
    await updateJobForPaymentSuccessUsingJobId(subscription.metadata.jobId);
  } catch (error) {
    console.error("Error handling invoice.paid event:", error);
    throw error;
  }
}
