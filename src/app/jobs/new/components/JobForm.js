"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password";
import { MultiSelect } from "@/components/ui/multi-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createNewJob,
  updateJobForPaymentProcessing,
  updateUserWithStripeCustomerId,
} from "@/app/jobs/new/actions";

import getStripe from "@/lib/payments/stripe";
import getFormSchema from "@/app/jobs/new/schema";
import {
  PAYMENT_TYPE_ONE_TIME,
  PAYMENT_TYPE_RECURRING,
} from "@/lib/payments/stripe";

export function JobForm({ sessionUser, className, ...props }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(getFormSchema(sessionUser)),
    defaultValues: {},
  });

  /**
   * Handles the form submission process.
   *
   * @param {Object} formData - The data from the submitted form.
   */
  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);

      // Initialize Stripe.
      const stripe = await getStripe();
      // Create a new job and associated user.
      const { job, user } = await createNewJob(formData);
      // Create a Stripe checkout session.
      const checkoutSessionResponse = await createCheckoutSession(
        user,
        formData.subscription_type
      );

      // Update job and user details with the checkout session info.
      await updateJobAndUser(job, user, checkoutSessionResponse);
      // Redirect the user to the Stripe checkout page.
      await redirectToCheckout(stripe, checkoutSessionResponse);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Creates a new Stripe checkout session.
   *
   * @param {Object} user - The user for whom the session is being created.
   * @param {string} stripePriceId - The Stripe price ID for the subscription.
   * @returns {Object} The response from the checkout session creation.
   */
  const createCheckoutSession = async (user, stripePriceId) => {
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
  const updateJobAndUser = async (job, user, checkoutSessionResponse) => {
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
  const redirectToCheckout = async (stripe, checkoutSessionResponse) => {
    // Redirect the user to the Stripe checkout page.
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionResponse.session_id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {!sessionUser.organization && (
            <FormOrganizationSection form={form} isLoading={isLoading} />
          )}

          <FormJobSection form={form} isLoading={isLoading} />

          {!sessionUser.id && (
            <FormUserSection form={form} isLoading={isLoading} />
          )}

          <FormSubscriptionSection form={form} isLoading={isLoading} />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
}

function FormOrganizationSection({ form, isLoading }) {
  return (
    <div className="mb-10">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Tell us about your organization
        </h1>
        <p className="text-sm text-muted-foreground">
          We will automatically create a organization profile with all your job
          listings.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <FormField
            control={form.control}
            name="organization_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="sm:col-span-3">
          <FormField
            control={form.control}
            name="organization_website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} {...field} />
                </FormControl>
                <FormDescription>
                  Optional: Link to your public organization website
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}

function FormJobSection({ form, isLoading }) {
  return (
    <div className="mb-10">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Tell us about your job
        </h1>
        <p className="text-sm text-muted-foreground">
          Please be as detailed as possible describing the job opening.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <FormField
            control={form.control}
            name="job_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <FormField
            control={form.control}
            name="job_location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="sm:col-span-3">
          <FormField
            control={form.control}
            name="job_location_requirement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Requirement</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="REMOTE">Remote</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                    <SelectItem value="OFFICE">On office</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <FormField
            control={form.control}
            name="job_apply_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How to Apply</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} {...field} />
                </FormControl>
                <FormDescription>
                  Provite the URL of your public job page or the email address
                  to redirect applicants to.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <FormField
            control={form.control}
            name="job_employment_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FULL_TIME">Full-Time</SelectItem>
                      <SelectItem value="PART_TIME">Part-Time</SelectItem>
                      <SelectItem value="CONTRACT">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>Minimum salary provided</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="sm:col-span-3">
          <FormField
            control={form.control}
            name="job_compenstation_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Compensation Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SALARY">Salary</SelectItem>
                      <SelectItem value="HOURLY">Hourly</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>Maximum salary provided</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <FormField
            control={form.control}
            type="number"
            name="job_salary_low"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lower Salary Range</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    type="number"
                    min="0.00"
                    max="10000.00"
                    step="0.01"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Minimum salary provided</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="sm:col-span-3">
          <FormField
            control={form.control}
            name="job_salary_high"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upper Salary Range</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    type="number"
                    min="0.00"
                    max="10000.00"
                    step="0.01"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Maximum salary provided</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <FormField
            control={form.control}
            name="job_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    className="h-64 resize-none"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>Maximum salary provided</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <FormField
            control={form.control}
            name="search_tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Search Tags</FormLabel>
                <FormControl>
                  <MultiSelect disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}

function FormUserSection({ form, isLoading }) {
  return (
    <div className="pb-4">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Tell us about yourself
        </h1>
        <p className="text-sm text-muted-foreground">
          Please be as detailed as possible describing the job opening.
        </p>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <FormField
            control={form.control}
            name="user_first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="sm:col-span-3">
          <FormField
            control={form.control}
            name="user_last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <FormField
            control={form.control}
            name="user_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} {...field} />
                </FormControl>
                <FormDescription>
                  We will use it to send you confirmation email and links to
                  manage your job listing.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <FormField
            control={form.control}
            name="user_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="sm:col-span-3">
          <FormField
            control={form.control}
            name="user_password_confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}

function FormSubscriptionSection({ form, isLoading }) {
  return (
    <div className="pb-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Select your promotion plan
        </h1>
        <p className="text-sm text-muted-foreground">
          Get noticed by adding your logo, highlighting your post or pinning it
          to the top.
        </p>
      </div>

      <div className="mt-4">
        <FormField
          control={form.control}
          name="subscription_type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem
                        disabled={isLoading}
                        value={PAYMENT_TYPE_ONE_TIME}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">30 days</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem
                        disabled={isLoading}
                        value={PAYMENT_TYPE_RECURRING}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Ongoing until canceled
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
