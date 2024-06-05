"use server";

import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Handles POST requests to create a new Stripe checkout session.
 */
export async function POST() {
  try {
    const checkoutParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Non-recurring 30 Day Job Posting",
            },
            unit_amount: 22500,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/api/stripe/checkout-success?stripe_session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/cancel`,
    };

    const checkoutSession = await stripe.checkout.sessions.create(
      checkoutParams
    );

    // Send the session ID in the response
    return NextResponse.json({ id: checkoutSession.id }, { status: 200 });
  } catch (error) {
    // Log and handle errors
    console.error("Error processing payment:", error);
    NextResponse.json(
      {
        error: "An error occurred while processing your payment.",
      },
      { status: 500 }
    );
  }
}
