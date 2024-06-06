"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckCircledIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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

export function JobForm({ sessionUser, className, ...props }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(getFormSchema(sessionUser)),
    defaultValues: {},
  });

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);

      const stripe = await getStripe();
      const { job, user } = await createNewJob(formData);
      const checkoutSessionResponse = await createCheckoutSession(user);

      await updateJobAndUser(job, user, checkoutSessionResponse);
      await redirectToCheckout(stripe, checkoutSessionResponse);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCheckoutSession = async (user) => {
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
      }),
    });

    if (!checkoutSession.ok) {
      console.error("Failed to create checkout session");
      return;
    }

    return await checkoutSession.json();
  };

  const updateJobAndUser = async (job, user, checkoutSessionResponse) => {
    await updateJobForPaymentProcessing(
      job.id,
      checkoutSessionResponse.session_id
    );

    await updateUserWithStripeCustomerId(
      user.id,
      checkoutSessionResponse.customer_id
    );
  };

  const redirectToCheckout = async (stripe, checkoutSessionResponse) => {
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionResponse.session_id,
    });

    console.warn(error.message);
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

          <div className="py-8 w-full">
            <Button className="w-full" disabled={isLoading} type="submit">
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircledIcon className="mr-2 h-4 w-4" />
              )}
              Submit and start hiring for $299
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function FormOrganizationSection({ form, isLoading }) {
  return (
    <>
      <div className="flex flex-col space-y-2 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Tell us about your organization
        </h1>
        <p className="text-sm text-muted-foreground">
          We will automatically create a organization profile with all your job
          listings.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
    </>
  );
}

function FormJobSection({ form, isLoading }) {
  return (
    <>
      <div className="flex flex-col space-y-2 py-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Tell us about your job
        </h1>
        <p className="text-sm text-muted-foreground">
          Please be as detailed as possible describing the job opening.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <FormField
            control={form.control}
            name="job_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} {...field} />
                </FormControl>
                <FormDescription>Maximum salary provided</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
}

function FormUserSection({ form, isLoading }) {
  return (
    <>
      <div className="flex flex-col space-y-2 py-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Tell us about yourself
        </h1>
        <p className="text-sm text-muted-foreground">
          Please be as detailed as possible describing the job opening.
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
    </>
  );
}
