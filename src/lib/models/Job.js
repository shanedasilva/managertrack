import { faker } from "@faker-js/faker";
import client from "@/lib/database/client";
import { convertToSlug } from "@/lib/utils/string";

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
            logoURL: true,
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
      include: {
        industry: true,
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
 * Retrieves all active jobs
 *
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of jobs.
 * @throws {Error} - Throws an error if the retrieval process fails.
 */
export async function getSingleJobBySlug(slug) {
  try {
    // Retrieve all active jobs
    const queryParams = {
      where: {
        slug: slug,
        status: STATUS_OPEN,
      },
      include: {
        industry: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    };

    return await client.job.findUnique(queryParams);

    return feedJobs;
  } catch (error) {
    console.error("Error retrieving jobs:", error.message, error.stack);
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
    return await client.job.update({
      where: {
        stripeSessionId: stripeSessionId,
      },
      data: {
        activeUntil: activeUntil,
        status: STATUS_OPEN,
      },
    });
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
    return await client.job.update({
      where: {
        id: id,
      },
      data: {
        activeUntil: activeUntil,
        status: STATUS_OPEN,
      },
    });
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
export async function createJob(
  form,
  organizationId,
  userId,
  status = STATUS_DRAFT
) {
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
      status: status,
      organization: {
        connect: { id: organizationId },
      },
    };

    if (userId) {
      jobData.user = {
        connect: { id: userId },
      };
    }

    // Create the job in the database
    return await client.job.create({
      data: jobData,
    });
  } catch (error) {
    // Log and throw the error for debugging
    console.error(`Error creating job: ${error.message}`, error.stack);
    throw error;
  }
}

export async function getJobsByIndustryId(industryId) {
  try {
    const queryParams = {
      where: {
        industryId: industryId,
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoURL: true,
          },
        },
        city: {
          select: {
            id: true,
            name: true,
            slug: true,
            country: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          activeUntil: "desc",
        },
        {
          payScaleBegin: { sort: "desc", nulls: "last" },
        },
        {
          payScaleEnd: { sort: "desc", nulls: "last" },
        },
      ],
      take: 6,
    };

    // const jobs = await client.job.findMany(queryParams);
    const jobs = await generateJobs(6);

    return jobs;
  } catch (error) {
    console.error(
      "Error retrieving jobs by industry id:",
      error.message,
      error.stack
    );

    throw error;
  }
}

const JobCompType = {
  SALARY: "SALARY",
  HOURLY: "HOURLY",
  CONTRACT: "CONTRACT",
};

const JobLocType = {
  REMOTE: "REMOTE",
  ONSITE: "ONSITE",
  HYBRID: "HYBRID",
};

const JobStatus = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

async function generateJobs(count) {
  const jobs = [];

  for (let i = 0; i < count; i++) {
    const job = {
      id: faker.datatype.uuid(),
      externalId: faker.datatype.number(),
      title: faker.name.jobTitle(),
      slug: faker.helpers.slugify(faker.name.jobTitle().toLowerCase()),
      applyURL: faker.internet.url(),
      compType: faker.helpers.arrayElement(Object.values(JobCompType)),
      payScaleBegin: faker.datatype.number({ min: 30000, max: 50000 }),
      payScaleEnd: faker.datatype.number({ min: 50001, max: 100000 }),
      payCurrency: faker.finance.currencyCode(),
      description: faker.lorem.paragraphs(2),
      jobLocType: faker.helpers.arrayElement(Object.values(JobLocType)),
      status: JobStatus.DRAFT,
      customQuestions: [],
      stripeSessionId: faker.datatype.uuid(),
      activeUntil: faker.date.future(),
      typeId: faker.datatype.uuid(),
      organizationId: faker.datatype.uuid(),
      userId: faker.datatype.uuid(),
      industryId: faker.datatype.uuid(),
      cityId: faker.datatype.uuid(),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
      deletedAt: null,
      organization: {
        name: faker.company.name(),
        logoURL:
          "https://pbs.twimg.com/profile_images/1217566226827759616/hM6lnfw8_400x400.jpg",
      },
      city: {
        name: faker.location.city(),
        country: {
          name: faker.location.country(),
        },
      },
    };

    jobs.push(job);
  }

  return jobs;
}
