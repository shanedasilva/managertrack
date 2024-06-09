import client from "@/lib/database/client";

// Constants
export const STATUS_OPEN = "OPEN";
export const STATUS_PAYMENT_PROCESSING = "PAYMENT_PROCESSING";
export const STATUS_DRAFT = "DRAFT";

/**
 * Asynchronously retrieves feed jobs from the database.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of feed jobs.
 */
export async function getFeedJobs() {
  return await client.job.findMany({
    where: {
      activeUntil: {
        gte: new Date(),
      },
      status: STATUS_OPEN,
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
      status: STATUS_PAYMENT_PROCESSING,
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
  // Calculate the date until which the job will be active (30 days from today)
  const today = new Date();
  const activeUntil = new Date(today.setDate(today.getDate() + 30));

  return await client.job.update({
    where: {
      stripeSessionId: stripeSessionId,
    },
    data: {
      activeUntil: activeUntil,
      status: STATUS_OPEN,
    },
  });
}

/**
 * Asynchronously updates a job for payment success using the job ID.
 *
 * @param {string} stripeSessionId - The ID of the job for payment success.
 * @returns {Promise<Object>} A promise that resolves to the updated job.
 */
export async function updateJobForPaymentSuccessUsingJobId(id) {
  // Calculate the date until which the job will be active (30 days from today)
  const today = new Date();
  const activeUntil = new Date(today.setDate(today.getDate() + 30));

  return await client.job.update({
    where: {
      id: id,
    },
    data: {
      activeUntil: activeUntil,
      status: STATUS_OPEN,
    },
  });
}

/**
 * Asynchronously creates a new job.
 *
 * @param {Object} form - Form object containing information about the job.
 * @param {number} organizationId - The ID of the organization associated with the job.
 * @param {number} userId - The ID of the user creating the job.
 * @returns {Promise<Object>} A promise that resolves to the created job object.
 * @throws {Error} Throws an error if job creation fails.
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
        category: form.job_category,
        status: STATUS_DRAFT,
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
    throw error;
  }
}
