"use server";

import { CreateNewOrganizationWithUseAndJob } from "@/lib/models/Organization";
import { UpdateJobForPaymentProcessingUsingJobId } from "@/lib/models/Job";

export const createOrganizationAndJob = async (values) => {
  return await CreateNewOrganizationWithUseAndJob(values);
};

export const updateJobForPaymentProcessing = async (jobId, stripeSessionId) => {
  return await UpdateJobForPaymentProcessingUsingJobId(jobId, stripeSessionId);
};
