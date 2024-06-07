"use server";

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { findUserByClerkUserId } from "@/lib/models/User";
import { createBillingPortalSession } from "@/lib/payments/stripe";

/**
 * Handles GET requests to create a new Stripe billing portal session.
 */
export async function GET() {
  try {
    const { userId } = auth();

    if (userId) {
      const sessionUser = await findUserByClerkUserId(userId);
      const billingSession = await createBillingPortalSession(
        sessionUser.stripeUserId
      );

      return NextResponse.redirect(billingSession.url);
    }

    return NextResponse.json({ status: 404 });
  } catch (error) {
    console.error("Error creating billing portal session:", error);

    NextResponse.json(
      {
        error: "An error occurred while creating your billing portal",
      },
      { status: 500 }
    );
  }
}
