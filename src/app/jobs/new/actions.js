"use server";

import { auth } from "@clerk/nextjs/server";

import { createOrganization } from "@/lib/models/Organization";
import {
  createUser,
  updateUserWithStripeCustomerIdUsingId,
  findUserByClerkUserId,
} from "@/lib/models/User";
import {
  createJob,
  updateJobForPaymentProcessingUsingJobId,
} from "@/lib/models/Job";
import { createOrganizationUser } from "@/lib/models/OrganizationUser";

export const createNewJob = async (form) => {
  const { userId } = auth();
  let sessionUser = await findUserByClerkUserId(userId);

  if (!sessionUser) {
    // create organization
    let newOrganization = await createOrganization(form);
    // create user
    let newUser = await createUser(form, newOrganization.id);
    // create organizations_users
    await createOrganizationUser(newOrganization.id, sessionUser.id);
    // create job
    let newJob = await createJob(form, newOrganization.id, newUser.id);
    // create clerk user

    // authenticate clerk user

    return { job: newJob };
  } else if (sessionUser && !sessionUser.organization) {
    // create organization
    let newOrganization = await createOrganization(form);
    // create organizations_users
    await createOrganizationUser(newOrganization.id, sessionUser.id);
    // create job
    let newJob = await createJob(form, newOrganization.id, sessionUser.id);

    return { job: newJob };
  } else if (sessionUser && sessionUser.organization) {
    // create job
    let newJob = await createJob(
      form,
      sessionUser.organization.organizationId,
      sessionUser.id
    );

    return { job: newJob };
  }

  return null;
};

// /**
//  * Creates a new organization with a user.
//  *
//  * @param {Object} values - Data object containing information about the organization, user, and job.
//  * @returns {Promise<Object>} A promise that resolves to an object containing the created organization and job.
//  */
// export const createOrganization = async (name, website) => {
//   return await createOrganization(name, website);
// };

// /**
//  * Creates a new organization with a user.
//  *
//  * @param {Object} values - Data object containing information about the organization, user, and job.
//  * @returns {Promise<Object>} A promise that resolves to an object containing the created organization and job.
//  */
// export const createUser = async (
//   firstName,
//   lastName,
//   email,
//   clerkUserId = null,
//   organizationId = null
// ) => {
//   return await createUser(
//     firstName,
//     lastName,
//     email,
//     clerkUserId,
//     organizationId
//   );
// };

// /**
//  * Creates a new organization with a user.
//  *
//  * @param {Object} values - Data object containing information about the organization, user, and job.
//  * @returns {Promise<Object>} A promise that resolves to an object containing the created organization and job.
//  */
// export const createJob = async (jobData, organizationId, userId) => {
//   return await createJob(jobData, organizationId, userId);
// };

/**
 * Updates a job for payment processing using its ID.
 *
 * @param {number} jobId - The ID of the job to be updated.
 * @param {string} stripeSessionId - The ID of the Stripe session for payment processing.
 * @returns {Promise<Object>} A promise that resolves to the updated job.
 */
export const updateJobForPaymentProcessing = async (jobId, stripeSessionId) => {
  return await updateJobForPaymentProcessingUsingJobId(jobId, stripeSessionId);
};

/**
 * Updates a user with a Stripe customer ID using their ID.
 *
 * @param {number} userId - The ID of the user to be updated.
 * @param {string} stripeUserId - The Stripe customer ID to be associated with the user.
 * @returns {Promise<Object>} A promise that resolves to the updated user.
 */
export const updateUserWithStripeCustomerId = async (userId, stripeUserId) => {
  return await updateUserWithStripeCustomerIdUsingId(userId, stripeUserId);
};
