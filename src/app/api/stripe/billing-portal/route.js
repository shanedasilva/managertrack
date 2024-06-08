"use server";

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { findUserByClerkUserId } from "@/lib/models/User";
import { createBillingPortalSession } from "@/lib/payments/stripe";

/**
 * Handles GET requests to create a new Stripe billing portal session.
 *
 * @returns {Promise<NextResponse>} The response to be sent back.
 */
export async function GET() {
  try {
    // Retrieve the authenticated user's ID
    const { userId } = auth();

    // If a user ID exists, proceed with session creation
    if (userId) {
      // Find the user in the database using their Clerk user ID
      const sessionUser = await findUserByClerkUserId(userId);

      // Create a Stripe billing portal session using the user's Stripe ID
      const billingSession = await createBillingPortalSession(
        sessionUser.stripeUserId
      );

      // Redirect the user to the Stripe billing portal
      return NextResponse.redirect(billingSession.url);
    }

    // If no user ID is found, return a 404 status
    return NextResponse.json({ status: 404 });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error creating billing portal session:", error);

    // Return a 500 status with an error message
    return NextResponse.json(
      {
        error: "An error occurred while creating your billing portal",
      },
      { status: 500 }
    );
  }
}
