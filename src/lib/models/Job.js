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
    take: 5,
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

/**
 * Asynchronously creates a new job.
 *
 * @param {Object} data - Data object containing information about the job.
 * @returns {Promise<Object>} A promise that resolves to an object containing job.
 */
export async function createJob(form, organizationId, userId) {
  try {
    return await client.job.create({
      data: {
        title: form.job_title,
        jobType: form.job_employment_type,
        location: form.job_location,
        compType: form.job_compenstation_type,
        payScaleBegin: form.job_salary_low,
        payScaleEnd: form.job_salary_high,
        description: form.job_description,
        jobLocType: form.job_location_requirement,
        status: "DRAFT",
        organization: {
          connect: { id: organizationId },
        },
        user: {
          connect: { id: userId },
        },
      },
    });
  } catch (error) {
    console.error("Error creating job: ", error);
  }
}
