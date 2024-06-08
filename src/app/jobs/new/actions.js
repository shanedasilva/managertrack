"use server";

import { auth } from "@clerk/nextjs/server";
import { createClerkUser } from "@/lib/auth/clerk";
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

/**
 * Creates a new job and associated entities based on the form data.
 *
 * @param {Object} form - The form data containing job, user, and organization details.
 * @param {string} form.user_first_name - User's first name.
 * @param {string} form.user_last_name - User's last name.
 * @param {string} form.user_email - User's email address.
 * @param {string} form.user_password - User's password.
 * @param {string} form.organization_name - Organization's name.
 * @param {string} form.organization_website - Organization's website.
 * @param {string} form.title - Job title.
 * @param {string} form.description - Job description.
 * @param {Array<string>} form.skills - Required job skills.
 * @param {string} form.location - Job location.
 * @param {string} form.type - Job type (e.g., full_time, part_time).
 * @returns {Promise<{job: Object, user: Object}>} A promise that resolves to the created job and user.
 * @throws {Error} Throws an error if the job creation process fails.
 */
export const createNewJob = async (form) => {
  const { userId } = auth();
  let sessionUser = null;

  try {
    if (userId) {
      console.log(`Fetching session user for userId ${userId}...`);
      sessionUser = await findUserByClerkUserId(userId);
      console.log(`Fetched session user:`, sessionUser);
    }

    if (!sessionUser) {
      console.log(
        "No session user found, creating new user and organization..."
      );
      return await handleNewUserAndOrganization(form);
    } else if (sessionUser && !sessionUser.organization) {
      console.log(
        `Session user ${sessionUser.id} has no organization, creating new organization...`
      );
      return await handleExistingUserNoOrganization(sessionUser, form);
    } else if (sessionUser && sessionUser.organization) {
      console.log(
        `Session user ${sessionUser.id} has an organization, creating new job...`
      );
      return await handleExistingUserWithOrganization(sessionUser, form);
    }

    return null;
  } catch (error) {
    console.error("Error creating new job:", error);
    throw new Error("An error occurred while creating the new job.");
  }
};

/**
 * Handles the creation of a new user and organization.
 *
 * @param {Object} form - The form data containing user and organization information.
 * @returns {Promise<{job: Object, user: Object}>} A promise that resolves to the created job and user.
 * @throws {Error} Throws an error if any step of the process fails.
 */
const handleNewUserAndOrganization = async (form) => {
  const { user_first_name, user_last_name, user_email, user_password } = form;

  try {
    console.log("Creating new organization...");
    const newOrganization = await createOrganization(form);

    console.log("Creating Clerk user...");
    const clerkUser = await createClerkUser(
      user_first_name,
      user_last_name,
      user_email,
      user_password
    );

    console.log("Creating new user...");
    const newUser = await createUser(form, clerkUser.id);

    console.log("Creating organization user relationship...");
    await createOrganizationUser(newOrganization.id, newUser.id);

    console.log("Creating new job...");
    const newJob = await createJob(form, newOrganization.id, newUser.id);

    console.log("Successfully created new job and user.");
    return { job: newJob, user: newUser };
  } catch (error) {
    console.error("Error during new user and organization creation:", error);

    throw new Error(
      "An error occurred while creating the user and organization."
    );
  }
};

/**
 * Handles the creation of a new organization for an existing user.
 *
 * @param {Object} sessionUser - The existing session user.
 * @param {Object} form - The form data.
 * @returns {Promise<{job: Object, user: Object}>} A promise that resolves to the created job and user.
 * @throws {Error} Throws an error if job or organization creation fails.
 */
const handleExistingUserNoOrganization = async (sessionUser, form) => {
  const { id: userId } = sessionUser;

  try {
    console.log(`Creating new organization for user ${userId}...`);
    const newOrganization = await createOrganization(form);
    console.log(
      `Successfully created organization with ID ${newOrganization.id} for user ${userId}.`
    );

    await createOrganizationUser(newOrganization.id, userId);
    console.log(
      `Successfully associated user ${userId} with organization ${newOrganization.id}.`
    );

    const newJob = await createJob(form, newOrganization.id, userId);
    console.log(
      `Successfully created job with ID ${newJob.id} for user ${userId} in organization ${newOrganization.id}.`
    );

    return { job: newJob, user: sessionUser };
  } catch (error) {
    console.error(
      `Error creating job or organization for user ${userId}:`,
      error
    );

    throw new Error(
      "An error occurred while creating the organization or job."
    );
  }
};

/**
 * Handles the creation of a new job for an existing user with an organization.
 *
 * @param {Object} sessionUser - The existing session user.
 * @param {Object} form - The form data.
 * @returns {Promise<{job: Object, user: Object}>} A promise that resolves to the created job and user.
 * @throws {Error} Throws an error if job creation fails.
 */
const handleExistingUserWithOrganization = async (sessionUser, form) => {
  const { organizationId } = sessionUser.organization;
  const { id: userId } = sessionUser;

  try {
    console.log(
      `Creating new job for user ${userId} in organization ${organizationId}...`
    );
    const newJob = await createJob(form, organizationId, userId);
    console.log(
      `Successfully created job with ID ${newJob.id} for user ${userId}.`
    );

    return { job: newJob, user: sessionUser };
  } catch (error) {
    console.error(`Error creating job for user ${userId}:`, error);

    throw new Error("An error occurred while creating the job.");
  }
};

/**
 * Updates a job for payment processing using its ID.
 *
 * @param {number} jobId - The ID of the job to be updated.
 * @param {string} stripeSessionId - The ID of the Stripe session for payment processing.
 * @returns {Promise<Object>} A promise that resolves to the updated job.
 * @throws {Error} Throws an error if the update fails.
 */
export const updateJobForPaymentProcessing = async (jobId, stripeSessionId) => {
  try {
    console.log(
      `Updating job ${jobId} for payment processing with Stripe session ID ${stripeSessionId}...`
    );
    const updatedJob = await updateJobForPaymentProcessingUsingJobId(
      jobId,
      stripeSessionId
    );
    console.log(`Updated job:`, updatedJob);

    return updatedJob;
  } catch (error) {
    console.error(`Error updating job ${jobId} for payment processing:`, error);

    throw new Error(
      "An error occurred while updating the job for payment processing."
    );
  }
};

/**
 * Updates a user with a Stripe customer ID using their ID.
 *
 * @param {number} userId - The ID of the user to be updated.
 * @param {string} stripeUserId - The Stripe customer ID to be associated with the user.
 * @returns {Promise<Object>} A promise that resolves to the updated user.
 * @throws {Error} Throws an error if the update fails.
 */
export const updateUserWithStripeCustomerId = async (userId, stripeUserId) => {
  try {
    console.log(
      `Updating user ${userId} with Stripe customer ID ${stripeUserId}...`
    );
    const updatedUser = await updateUserWithStripeCustomerIdUsingId(
      userId,
      stripeUserId
    );
    console.log(`Updated user:`, updatedUser);

    return updatedUser;
  } catch (error) {
    console.error(
      `Error updating user ${userId} with Stripe customer ID ${stripeUserId}:`,
      error
    );

    throw new Error(
      "An error occurred while updating the user with Stripe customer ID."
    );
  }
};

/**
 * Creates a new Stripe checkout session.
 *
 * @param {Object} user - The user for whom the session is being created.
 * @param {string} stripePriceId - The Stripe price ID for the subscription.
 * @returns {Object} The response from the checkout session creation.
 */
export const createCheckoutSession = async (user, stripePriceId) => {
  const checkoutSession = await fetch("/api/stripe/checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: user.id,
      userEmail: user.email,
      userFirstName: user.firstName,
      userLastName: user.lastName,
      paymentType: stripePriceId,
    }),
  });

  if (!checkoutSession.ok) {
    console.error("Failed to create checkout session");
    return;
  }

  return await checkoutSession.json();
};

/**
 * Updates the job and user with the Stripe checkout session information.
 *
 * @param {Object} job - The job to be updated.
 * @param {Object} user - The user to be updated.
 * @param {Object} checkoutSessionResponse - The response from the checkout session creation.
 */
export const updateJobAndUser = async (job, user, checkoutSessionResponse) => {
  // Update the job with the payment processing status.
  await updateJobForPaymentProcessing(
    job.id,
    checkoutSessionResponse.session_id
  );

  // Update the user with the Stripe customer ID.
  await updateUserWithStripeCustomerId(
    user.id,
    checkoutSessionResponse.customer_id
  );
};

/**
 * Redirects the user to the Stripe checkout page.
 *
 * @param {Object} stripe - The initialized Stripe instance.
 * @param {Object} checkoutSessionResponse - The response from the checkout session creation.
 */
export const redirectToCheckout = async (stripe, checkoutSessionResponse) => {
  // Redirect the user to the Stripe checkout page.
  const { error } = await stripe.redirectToCheckout({
    sessionId: checkoutSessionResponse.session_id,
  });

  if (error) {
    console.warn(error.message);
  }
};
