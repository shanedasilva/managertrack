import client from "@/lib/database/client";
import { convertToSlug } from "@/lib/utils/string";
import { createSearchObject, updateSearchObject } from "@/lib/search/client";

// Constants
export const STATUS_OPEN = "OPEN";
export const STATUS_PAYMENT_PROCESSING = "PAYMENT_PROCESSING";
export const STATUS_DRAFT = "DRAFT";

/**
 * Retrieves feed jobs that are active until a certain date and have an open status.
 *
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of feed jobs.
 * @throws {Error} - Throws an error if the retrieval process fails.
 */
export async function getFeedJobs() {
  try {
    // Retrieve feed jobs from the database
    const queryParams = {
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
            slug: true,
          },
        },
      },
      take: 5,
    };

    const feedJobs = await client.job.findMany(queryParams);

    return feedJobs;
  } catch (error) {
    console.error("Error retrieving feed jobs:", error.message, error.stack);
    throw error;
  }
}

/**
 * Retrieves all active jobs
 *
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of jobs.
 * @throws {Error} - Throws an error if the retrieval process fails.
 */
export async function getAllJobSlugsWithModifyTime() {
  try {
    // Retrieve all active jobs
    const queryParams = {
      where: {
        activeUntil: {
          gte: new Date(),
        },
        status: STATUS_OPEN,
      },
      select: {
        id: true,
        slug: true,
        updatedAt: true,
      },
    };

    const feedJobs = await client.job.findMany(queryParams);

    return feedJobs;
  } catch (error) {
    console.error("Error retrieving all jobs:", error.message, error.stack);
    throw error;
  }
}

/**
 * Updates a job for payment processing using its ID.
 *
 * @param {number} jobId - The ID of the job to be updated.
 * @param {string} stripeSessionId - The ID of the Stripe session for payment processing.
 * @returns {Promise<Object>} - A promise that resolves to the updated job object.
 * @throws {Error} - Throws an error if the update process fails.
 */
export async function updateJobForPaymentProcessingUsingJobId(
  jobId,
  stripeSessionId
) {
  try {
    // Update the job for payment processing
    const queryParams = {
      where: {
        id: jobId,
      },
      data: {
        stripeSessionId: stripeSessionId,
        status: STATUS_PAYMENT_PROCESSING,
      },
    };

    const updatedJob = await client.job.update(queryParams);

    return updatedJob;
  } catch (error) {
    console.error(
      `Error updating job for payment processing with ID ${jobId}:`,
      error.message,
      error.stack
    );
    throw error;
  }
}

/**
 * Updates a job for payment success using the Stripe session ID.
 *
 * @param {string} stripeSessionId - The ID of the Stripe session for payment success.
 * @returns {Promise<Object>} - A promise that resolves to the updated job object.
 * @throws {Error} - Throws an error if the update process fails.
 */
export async function updateJobForPaymentSuccessUsingStripeSessionId(
  stripeSessionId
) {
  try {
    // Calculate the date until which the job will be active (30 days from today)
    const today = new Date();
    const activeUntil = new Date(today.setDate(today.getDate() + 30));

    // Update the job for payment success
    const updatedJob = await client.job.update({
      where: {
        stripeSessionId: stripeSessionId,
      },
      data: {
        activeUntil: activeUntil,
        status: STATUS_OPEN,
      },
    });

    // If search is enabled, update search objects
    if (process.env.SEARCH_ENABLED) {
      await updateSearchObject("Job", {
        ...updatedJob,
        objectID: updatedJob.id,
      });
    }

    return updatedJob;
  } catch (error) {
    console.error(
      `Error updating job for payment success with Stripe session ID ${stripeSessionId}:`,
      error.message,
      error.stack
    );
    throw error;
  }
}

/**
 * Asynchronously updates a job for payment success using the job ID.
 *
 * @param {number} id - The ID of the job for payment success.
 * @returns {Promise<Object>} A promise that resolves to the updated job.
 * @throws {Error} Throws an error if the job update fails.
 */
export async function updateJobForPaymentSuccessUsingJobId(id) {
  try {
    // Calculate the date until which the job will be active (30 days from today)
    const today = new Date();
    const activeUntil = new Date(today.setDate(today.getDate() + 30));

    // Update the job in the database
    const updatedJob = await client.job.update({
      where: {
        id: id,
      },
      data: {
        activeUntil: activeUntil,
        status: STATUS_OPEN,
      },
    });

    // If search is enabled, update search objects
    if (process.env.SEARCH_ENABLED) {
      await updateSearchObject("Job", {
        ...updatedJob,
        objectID: updatedJob.id,
      });
    }

    return updatedJob;
  } catch (error) {
    // Log and throw the error for debugging
    console.error(
      `Error updating job for payment success: ${error.message}`,
      error.stack
    );
    throw error;
  }
}

/**
 * Creates a new job asynchronously.
 *
 * @param {Object} form - Form object containing information about the job.
 * @param {number} organizationId - The ID of the organization associated with the job.
 * @param {number} userId - The ID of the user creating the job.
 * @returns {Promise<Object>} - A promise that resolves to the created job object.
 * @throws {Error} - Throws an error if job creation fails.
 */
export async function createJob(form, organizationId, userId) {
  try {
    // Prepare data for job creation
    const jobData = {
      title: form.job_title,
      slug: convertToSlug(form.job_title),
      jobType: form.job_employment_type,
      location: form.job_location,
      compType: form.job_compenstation_type,
      payScaleBegin: form.job_salary_low,
      payScaleEnd: form.job_salary_high,
      description: form.job_description,
      jobLocType: form.job_location_requirement,
      category: "form.job_category",
      status: STATUS_DRAFT,
      organization: {
        connect: { id: organizationId },
      },
      user: {
        connect: { id: userId },
      },
    };

    // Create the job in the database
    const createdJob = await client.job.create({
      data: jobData,
    });

    // If search is enabled, create search objects
    if (process.env.SEARCH_ENABLED) {
      await createSearchObject("Job", {
        ...createdJob,
        objectID: createdJob.id,
      });
    }

    return createdJob;
  } catch (error) {
    // Log and throw the error for debugging
    console.error(`Error creating job: ${error.message}`, error.stack);
    throw error;
  }
}
