"use server";

import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

import {
  createStripeCustomer,
  createStripeCheckoutSession,
} from "@/lib/payments/stripe";

/**
 * Handles POST requests to create a new Stripe checkout session.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<NextResponse>} The response to be sent back.
 */
export async function POST(request) {
  try {
    // Extract necessary fields from the request body
    const { userId, userEmail, userFirstName, userLastName, paymentType } =
      await request.json();

    // Create a new Stripe customer
    const stripeCustomer = await createStripeCustomer(
      userId,
      userEmail,
      userFirstName,
      userLastName
    );

    // Create a new Stripe checkout session for the customer
    const stripeCheckoutSession = await createStripeCheckoutSession(
      stripeCustomer.id,
      paymentType
    );

    // Return the session ID and customer ID as the response
    return NextResponse.json(
      { session_id: stripeCheckoutSession.id, customer_id: stripeCustomer.id },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error processing payment:", error);

    // Return a 500 status with an error message
    return NextResponse.json(
      {
        error: "An error occurred while processing your payment.",
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
