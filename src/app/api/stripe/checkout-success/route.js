"use server";

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { updateJobForPaymentSuccessUsingStripeSessionId } from "@/lib/models/Job";

const NUMBER_OF_DAYS_POST_ACTIVE = 30;

/**
 * Handles GET requests to update a job's payment status and redirect the user.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<NextResponse>} The response to be sent back.
 */
export async function GET(request) {
  // Authenticate the user
  const { userId } = auth();
  let redirectUrl = process.env.NEXT_PUBLIC_BASE_APP_URL;

  // Redirect unauthenticated users to the sign-in page
  if (!userId) {
    redirectUrl = `${process.env.NEXT_PUBLIC_BASE_APP_URL}/sign-in`;
  }

  // Extract the Stripe session ID from the request URL
  const { searchParams } = new URL(request.url);
  const stripeSessionId = searchParams.get("stripe_session_id");

  // Calculate the date until which the job will be active
  const today = new Date();
  const activeUntil = new Date(
    new Date().setDate(today.getDate() + NUMBER_OF_DAYS_POST_ACTIVE)
  );

  // Update the job status based on the successful payment
  await updateJobForPaymentSuccessUsingStripeSessionId(
    stripeSessionId,
    activeUntil
  );

  // Redirect the user to the appropriate URL
  return NextResponse.redirect(new URL(redirectUrl));
}
