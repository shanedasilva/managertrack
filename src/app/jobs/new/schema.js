import { z } from "zod";

const organizaitonSchema = z.object({
  organization_name: z
    .string({
      required_error: "Organization name is required",
    })
    .min(3, { message: "Must be 3 or more characters long" })
    .max(300, { message: "Must be 30 or less characters long" }),
  organization_website: z
    .string({
      required_error: "Organization URL is required",
    })
    .url({ message: "Invalid url" }),
  organization_tagline: z.string().optional(),
});

const jobSchema = z.object({
  job_title: z
    .string({
      required_error: "Job name is required",
    })
    .min(2, { message: "Must be 2 or more characters long" })
    .max(30, { message: "Must be 30 or less characters long" }),
  job_location: z
    .string({
      required_error: "Job location is required",
    })
    .min(2, { message: "Must be 2 or more characters long" })
    .max(30, { message: "Must be 30 or less characters long" }),
  job_location_requirement: z.string({
    required_error: "Job location requirement is required",
  }),
  job_apply_url: z
    .string({
      required_error: "Apply URL is required",
    })
    .url({ message: "Invalid url" }),
  job_employment_type: z.string({
    required_error: "Employment type is required",
  }),
  job_compenstation_type: z.string({
    required_error: "Compensation type is required",
  }),
  job_salary_low: z.coerce.number().nonnegative().optional(),
  job_salary_high: z.coerce.number().nonnegative().optional(),
  job_description: z
    .string({
      required_error: "Job description is required",
    })
    .min(10, { message: "Must be 10 or more characters long" })
    .max(500, { message: "Must be 500 or less characters long" }),
});

const userSchema = z.object({
  user_first_name: z
    .string({
      required_error: "First name is required",
    })
    .min(2, { message: "Must be 2 or more characters long" })
    .max(20, { message: "Must be 20 or less characters long" }),
  user_last_name: z
    .string({
      required_error: "Last name is required",
    })
    .min(2, { message: "Must be 2 or more characters long" })
    .max(20, { message: "Must be 20 or less characters long" }),
  user_email: z
    .string({
      required_error: "Email is required",
    })
    .email()
    .min(2, { message: "Must be 2 or more characters long" })
    .max(40, { message: "Must be 40 or less characters long" }),
  user_password: z
    .string({
      required_error: "Password is required",
    })
    .min(2, { message: "Must be 2 or more characters long" })
    .max(40, { message: "Must be 40 or less characters long" }),
  user_password_confirm: z.string(),
});

const getFormSchema = (sessionUser) => {
  // User is authenticated and has created an organization
  if (sessionUser.id && sessionUser.organization?.organizationId) {
    return z.object({
      ...jobSchema.shape,
    });
  }

  // User is authenticated and has NOT created an organization
  // This state occurs when users has first created Clerk account
  if (sessionUser.id && !sessionUser.organization?.organizationId) {
    return z.object({
      ...organizaitonSchema.shape,
      ...jobSchema.shape,
    });
  }

  // User does not yet have an account created
  return z.object({
    ...organizaitonSchema.shape,
    ...jobSchema.shape,
    ...userSchema.shape,
  });
};

export default getFormSchema;
