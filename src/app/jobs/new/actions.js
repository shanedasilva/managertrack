"use server";

import { createNewOrganizationWithUserAndJob } from "@/lib/models/Organization";
import { updateJobForPaymentProcessingUsingJobId } from "@/lib/models/Job";
import { updateUserWithStripeCustomerIdUsingId } from "@/lib/models/User";

/**
 * Creates a new organization with a user and a job.
 *
 * @param {Object} values - Data object containing information about the organization, user, and job.
 * @returns {Promise<Object>} A promise that resolves to an object containing the created organization and job.
 */
export const createOrgAndJob = async (values) => {
  return await createNewOrganizationWithUserAndJob(values);
};

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
