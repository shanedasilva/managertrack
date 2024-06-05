"use server";

import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Handles POST requests which accepts incoming webhook events from Stripe.
 */
export async function POST(req, res) {
  const buf = await buffer(req);
  const signature = req.headers["stripe-signature"];

  let event = null;

  try {
    event = stripe.webhooks.constructEvent(
      buf.toString(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`❌ Error message: ${err.message}`);

    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "charge.succeeded":
      const chargeSucceeded = event.data.object;
      // Then define and call a function to handle the event charge.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Successfully constructed event
  console.log("✅ Success:", event.id);
}
