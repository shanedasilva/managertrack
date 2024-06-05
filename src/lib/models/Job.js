import client from "@/lib/database/client";

/**
 * Asynchronously retrieves feed jobs from the database.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to the feed jobs.
 */
export async function getFeedJobs() {
  return await client.job.findMany({
    where: {
      status: "OPEN",
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

/**
 * Asynchronously updates a job for payment processing using its ID.
 *
 * @param {number} jobId - The ID of the job to be updated.
 * @param {string} stripeSessionId - The ID of the Stripe session for payment processing.
 * @returns {Promise<Object>} A promise that resolves to the updated job.
 */
export async function updateJobForPaymentProcessingUsingJobId(
  jobId,
  stripeSessionId
) {
  return await client.job.update({
    where: {
      id: jobId,
    },
    data: {
      stripeSessionId: stripeSessionId,
      status: "PAYMENT_PROCESSING",
    },
  });
}

/**
 * Asynchronously updates a job for payment success using the Stripe session ID.
 *
 * @param {string} stripeSessionId - The ID of the Stripe session for payment success.
 * @returns {Promise<Object>} A promise that resolves to the updated job.
 */
export async function updateJobForPaymentSuccessUsingStripeSessionId(
  stripeSessionId
) {
  return await client.job.update({
    where: {
      stripeSessionId: stripeSessionId,
    },
    data: {
      status: "OPEN",
    },
  });
}
