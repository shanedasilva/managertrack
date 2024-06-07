import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe instance with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize a promise to lazily load Stripe with the public key
let stripePromise = null;

const ONE_TIME_PRICE_ID = "price_1PO4P9HWCFf8SDJTyfNtIL1F";
const RECURRING_PRICE_ID = "price_1PP8PeHWCFf8SDJTuFWbfMW4";

/**
 * Lazily loads Stripe with the public key.
 * @returns {Promise<Stripe>} - Promise resolving to the Stripe instance.
 */
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }

  return stripePromise;
};

/**
 * Creates a new customer in Stripe.
 *
 * @param {string} id - Unique identifier for the customer.
 * @param {string} email - Email of the customer.
 * @param {string} firstName - First name of the customer.
 * @param {string} lastName - Last name of the customer.
 * @returns {Promise<Object>} - Promise resolving to the created customer object.
 * @throws {Error} - Throws an error if creation fails.
 */
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

/**
 * Creates a Stripe checkout session for a given customer.
 *
 * @param {string} customerId - ID of the customer in Stripe.
 * @returns {Promise<Object>} - Promise resolving to the created checkout session object.
 * @throws {Error} - Throws an error if session creation fails.
 */
export async function createStripeCheckoutSession(customerId, paymentType) {
  const params = {
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: RECURRING_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/stripe/checkout-success?stripe_session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_APP_URL}/cancel`,
  };

  if (paymentType == "one_time") {
    params.mode = "payment";
    params.line_items[0].price = ONE_TIME_PRICE_ID;
    params.invoice_creation = {
      enabled: true,
    };
  }

  try {
    return stripe.checkout.sessions.create(params);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

/**
 * Creates a new customer in Stripe.
 *
 * @returns {Promise<Object>} - Promise resolving to the created customer object.
 * @throws {Error} - Throws an error if creation fails.
 */
export async function createBillingPortalSession(stripeCustomerId) {
  try {
    const params = {
      customer: stripeCustomerId,
      return_url: process.env.NEXT_PUBLIC_BASE_APP_URL,
    };

    return stripe.billingPortal.sessions.create(params);
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
}

export default getStripe;
