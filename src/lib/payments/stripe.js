import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

let stripePromise = null;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }

  return stripePromise;
};

// Create a new customer
export async function createStripeCustomer(id, email, firstName, lastName) {
  try {
    const customer = await stripe.customers.create({
      name: `${firstName} ${lastName}`,
      email: email,
      metadata: {
        "ManagerTrack ID": id,
      },
    });

    return customer;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
}

export async function createStripeCheckoutSession(customerId) {
  try {
    const checkoutParams = {
      customer: customerId,
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

    return stripe.checkout.sessions.create(checkoutParams);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

export default getStripe;
