"use server";

import { NextResponse } from "next/server";

import {
  createStripeCustomer,
  createStripeCheckoutSession,
} from "@/lib/payments/stripe";

/**
 * Handles POST requests to create a new Stripe checkout session.
 */
export async function POST(request) {
  try {
    const { userId, userEmail, userFirstName, userLastName } =
      await request.json();

    const stripeCustomer = await createStripeCustomer(
      userId,
      userEmail,
      userFirstName,
      userLastName
    );

    const stripeCheckoutSession = await createStripeCheckoutSession(
      stripeCustomer.id
    );

    return NextResponse.json(
      { session_id: stripeCheckoutSession.id, customer_id: stripeCustomer.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing payment:", error);

    NextResponse.json(
      {
        error: "An error occurred while processing your payment.",
      },
      { status: 500 }
    );
  }
}
