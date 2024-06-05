"use server";

import { NextResponse } from "next/server";
import { UpdateJobForPaymentSuccessUsingStripeSessionId } from "@/lib/models/Job";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const stripeSessionId = searchParams.get("stripe_session_id");

  await UpdateJobForPaymentSuccessUsingStripeSessionId(stripeSessionId);

  return NextResponse.redirect(new URL("http://localhost:3000"));
}
