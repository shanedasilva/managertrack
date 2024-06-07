"use server";

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { updateJobForPaymentSuccessUsingStripeSessionId } from "@/lib/models/Job";

const NUMBER_OF_DAYS_POST_ACTIVE = 30;

export async function GET(request) {
  const { userId } = auth();
  let redirectUrl = process.env.NEXT_PUBLIC_BASE_APP_URL;

  if (!userId) {
    redirectUrl = `${process.env.NEXT_PUBLIC_BASE_APP_URL}/sign-in`;
  }

  const { searchParams } = new URL(request.url);
  const stripeSessionId = searchParams.get("stripe_session_id");

  const today = new Date();
  const activeUntil = new Date(
    new Date().setDate(today.getDate() + NUMBER_OF_DAYS_POST_ACTIVE)
  );

  await updateJobForPaymentSuccessUsingStripeSessionId(
    stripeSessionId,
    activeUntil
  );

  return NextResponse.redirect(new URL(redirectUrl));
}
