import client from "../database/client";

/**
 * Create a user from the database asynchronously.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to the created user
 */
export async function GetFeedJobs() {
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

export async function UpdateJobForPaymentProcessingUsingJobId(
  jobId,
  stripeSessionId
) {
  return await prisma.job.update({
    where: {
      id: jobId,
    },
    data: {
      stripeSessionId: stripeSessionId,
      status: "PAYMENT_PROCESSING",
    },
  });
}

export async function UpdateJobForPaymentSuccessUsingStripeSessionId(
  stripeSessionId
) {
  return await prisma.job.update({
    where: {
      stripeSessionId: stripeSessionId,
    },
    data: {
      stripeSessionId: null,
      status: "OPEN",
    },
  });
}
