import { z } from "zod";

/**
 * Schema for validating organization data.
 */
const organizationSchema = z.object({
  organization_name: z
    .string({
      required_error: "Organization name is required",
    })
    .min(3, { message: "Organization name must be 3 or more characters long" })
    .max(300, {
      message: "Organization name must be 300 or fewer characters long",
    }),
  organization_website: z
    .string({
      required_error: "Organization URL is required",
    })
    .url({ message: "Invalid URL" }),
  organization_tagline: z
    .string()
    .max(100, { message: "Tagline must be 100 or fewer characters long" })
    .optional(),
});

/**
 * Schema for validating job data.
 */
const jobSchema = z.object({
  job_title: z
    .string({
      required_error: "Job title is required",
    })
    .min(2, { message: "Job title must be 2 or more characters long" })
    .max(30, { message: "Job title must be 30 or fewer characters long" }),
  job_location: z
    .string({
      required_error: "Job location is required",
    })
    .min(2, { message: "Job location must be 2 or more characters long" })
    .max(30, { message: "Job location must be 30 or fewer characters long" }),
  job_location_requirement: z.string({
    required_error: "Job location requirement is required",
  }),
  job_apply_url: z
    .string({
      required_error: "Apply URL is required",
    })
    .url({ message: "Invalid URL" }),
  job_employment_type: z.string({
    required_error: "Employment type is required",
  }),
  job_compensation_type: z.string({
    required_error: "Compensation type is required",
  }),
  job_salary_low: z.coerce
    .number({
      invalid_type_error: "Salary must be a number",
    })
    .nonnegative({ message: "Salary must be non-negative" })
    .optional(),
  job_salary_high: z.coerce
    .number({
      invalid_type_error: "Salary must be a number",
    })
    .nonnegative({ message: "Salary must be non-negative" })
    .optional(),
  job_category: z.string().optional(),
  job_description: z
    .string({
      required_error: "Job description is required",
    })
    .min(10, { message: "Job description must be 10 or more characters long" })
    .max(500, {
      message: "Job description must be 500 or fewer characters long",
    }),
  subscription_type: z.string({
    required_error: "Subscription type is required",
  }),
});

/**
 * Schema for validating user data.
 */
const userSchema = z.object({
  user_first_name: z
    .string({
      required_error: "First name is required",
    })
    .min(2, { message: "First name must be 2 or more characters long" })
    .max(20, { message: "First name must be 20 or fewer characters long" }),
  user_last_name: z
    .string({
      required_error: "Last name is required",
    })
    .min(2, { message: "Last name must be 2 or more characters long" })
    .max(20, { message: "Last name must be 20 or fewer characters long" }),
  user_email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Invalid email address" })
    .max(40, { message: "Email must be 40 or fewer characters long" }),
  user_password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, { message: "Password must be 8 or more characters long" }) // Improved security with a minimum length
    .max(40, { message: "Password must be 40 or fewer characters long" }),
  user_password_confirm: z
    .string({
      required_error: "Password confirmation is required",
    })
    .refine((val, ctx) => val === ctx.parent.user_password, {
      message: "Passwords do not match",
      path: ["user_password_confirm"], // Set the path to the field being validated
    }),
});

/**
 * Returns the appropriate schema based on the session user's state.
 *
 * @param {Object} sessionUser - The current session user.
 * @param {string} sessionUser.id - The user's ID.
 * @param {Object} [sessionUser.organization] - The user's organization, if any.
 * @param {string} [sessionUser.organization.organizationId] - The organization's ID, if any.
 * @returns {z.ZodObject} The combined schema for validation.
 */
const getFormSchema = (sessionUser) => {
  // User is authenticated and has created an organization
  if (sessionUser.id && sessionUser.organization?.organizationId) {
    return jobSchema;
  }

  // User is authenticated and has NOT created an organization
  // This state occurs when the user has first created a Clerk account
  if (sessionUser.id && !sessionUser.organization?.organizationId) {
    return z.object({
      ...organizationSchema.shape,
      ...jobSchema.shape,
    });
  }

  // User does not yet have an account created
  return z.object({
    ...organizationSchema.shape,
    ...jobSchema.shape,
    ...userSchema.shape,
  });
};

export default getFormSchema;
