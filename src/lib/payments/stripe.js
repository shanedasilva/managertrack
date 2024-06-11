import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe instance with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Retrieve the Stripe webhook secret from environment variables
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Initialize a promise to lazily load Stripe with the public key
let stripePromise = null;

const STRIPE_ONE_TIME_PRICE_ID = process.env.STRIPE_ONE_TIME_PRICE_ID;
const STRIPE_RECURRING_PRICE_ID = process.env.STRIPE_RECURRING_PRICE_ID;

export const PAYMENT_TYPE_ONE_TIME = "ONE_TIME";
export const PAYMENT_TYPE_RECURRING = "RECURRING";

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
 * Updates an existing customer in Stripe.
 *
 * @param {string} id - Unique identifier for the customer.
 * @param {string} email - Email of the customer.
 * @param {string} firstName - First name of the customer.
 * @param {string} lastName - Last name of the customer.
 * @returns {Promise<Object>} - Promise resolving to the created customer object.
 * @throws {Error} - Throws an error if creation fails.
 */
export async function updateStripeCustomer(
  stripeId,
  email,
  firstName,
  lastName
) {
  try {
    const customer = await stripe.customers.update(stripeId, {
      name: `${firstName} ${lastName}`,
      email: email,
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
 * @param {string} paymentType - Type of payment ("ONE_TIME" or "RECURRING").
 * @returns {Promise<Object>} - Promise resolving to the created checkout session object.
 * @throws {Error} - Throws an error if session creation fails.
 */
export async function createStripeCheckoutSession(customerId, paymentType) {
  const params = {
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: STRIPE_RECURRING_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/stripe/checkout-success?stripe_session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/stripe/checkout-cancel`,
  };

  if (paymentType === PAYMENT_TYPE_ONE_TIME) {
    params.mode = "payment";
    params.line_items[0].price = STRIPE_ONE_TIME_PRICE_ID;
    params.invoice_creation = {
      enabled: true,
    };
  }

  try {
    return await stripe.checkout.sessions.create(params);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

/**
 * Creates a billing portal session for a given customer.
 *
 * @param {string} stripeCustomerId - ID of the customer in Stripe.
 * @returns {Promise<Object>} - Promise resolving to the created billing portal session object.
 * @throws {Error} - Throws an error if session creation fails.
 */
export async function createStripeBillingPortalSession(stripeCustomerId) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: process.env.NEXT_PUBLIC_BASE_APP_URL,
    });

    return session;
  } catch (error) {
    console.error("Error creating billing portal session:", error);
    throw error;
  }
}

/**
 * Constructs a Stripe webhook event from the request body and signature.
 *
 * @param {string} body - The raw body of the request.
 * @param {string} signature - The Stripe signature from the request headers.
 * @returns {Object} - The constructed Stripe event object.
 * @throws {Error} - Throws an error if event construction fails.
 */
export function createStripeWebhookEvent(body, signature) {
  return stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
}

/**
 * Retrieves a Stripe checkout session by its ID.
 *
 * @param {string} sessionId - The ID of the Stripe checkout session.
 * @returns {Promise<Object>} - Promise resolving to the retrieved checkout session object.
 */
export async function getStripeSession(sessionId) {
  return stripe.checkout.sessions.retrieve(sessionId);
}

/**
 * Retrieves a Stripe subscription by its ID.
 *
 * @param {string} subscriptionId - The ID of the Stripe subscription.
 * @returns {Promise<Object>} - Promise resolving to the retrieved subscription object.
 */
export async function getStripeSubscription(subscriptionId) {
  return stripe.subscriptions.retrieve(subscriptionId);
}

/**
 * Updates a Stripe invoice with job ID metadata.
 *
 * @param {string} invoiceId - The ID of the Stripe invoice.
 * @param {string} jobId - The job ID to be added to the invoice metadata.
 * @returns {Promise<Object>} - Promise resolving to the updated invoice object.
 */
export async function updateStripeInvoiceWithJobIdMetadata(invoiceId, jobId) {
  return stripe.invoices.update(invoiceId, {
    metadata: {
      jobId: jobId,
    },
  });
}

/**
 * Updates a Stripe subscription with job ID metadata.
 *
 * @param {string} subscriptionId - The ID of the Stripe subscription.
 * @param {string} jobId - The job ID to be added to the subscription metadata.
 * @returns {Promise<Object>} - Promise resolving to the updated subscription object.
 */
export async function updateStripeSubscriptionWithJobIdMetadata(
  subscriptionId,
  jobId
) {
  return stripe.subscriptions.update(subscriptionId, {
    metadata: {
      jobId: jobId,
    },
  });
}

export default getStripe;
