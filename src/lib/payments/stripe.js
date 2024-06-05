import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe instance with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize a promise to lazily load Stripe with the public key
let stripePromise = null;

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
export async function createStripeCheckoutSession(customerId) {
  try {
    const checkoutParams = {
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRODUCT_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "payment",
      invoice_creation: {
        enabled: true,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/stripe/checkout-success?stripe_session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_APP_URL}/cancel`,
    };

    return stripe.checkout.sessions.create(checkoutParams);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

export default getStripe;
