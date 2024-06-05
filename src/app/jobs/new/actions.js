"use server";

import { CreateNewOrganizationWithUseAndJob } from "@/lib/models/Organization";
import { UpdateJobForPaymentProcessingUsingJobId } from "@/lib/models/Job";
import { UpdateUserWithStripeCustomerIdUsingId } from "@/lib/models/User";

export const createOrganizationAndJob = async (values) => {
  return await CreateNewOrganizationWithUseAndJob(values);
};

export const updateJobForPaymentProcessing = async (jobId, stripeSessionId) => {
  return await UpdateJobForPaymentProcessingUsingJobId(jobId, stripeSessionId);
};

export const updateUserWithStripeCustomerId = async (userId, stripeUserId) => {
  return await UpdateUserWithStripeCustomerIdUsingId(userId, stripeUserId);
};
