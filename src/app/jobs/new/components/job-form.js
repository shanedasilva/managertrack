"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckCircledIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
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

import { SaveRecords } from "@/app/jobs/new/actions";

const formSchema = z.object({
  // organization_name: z
  //   .string({
  //     required_error: "Organization name is required",
  //   })
  //   .min(3, { message: "Must be 3 or more characters long" })
  //   .max(300, { message: "Must be 30 or less characters long" }),
  // organization_website: z
  //   .string({
  //     required_error: "Organization URL is required",
  //   })
  //   .url({ message: "Invalid url" }),
  // organization_tagline: z.string().optional(),
  // job_title: z
  //   .string({
  //     required_error: "Job name is required",
  //   })
  //   .min(2, { message: "Must be 2 or more characters long" })
  //   .max(30, { message: "Must be 30 or less characters long" }),
  // job_location: z
  //   .string({
  //     required_error: "Job location is required",
  //   })
  //   .min(2, { message: "Must be 2 or more characters long" })
  //   .max(30, { message: "Must be 30 or less characters long" }),
  // job_location_requirement: z.string({
  //   required_error: "Job location requirement is required",
  // }),
  // job_apply_url: z
  //   .string({
  //     required_error: "Apply URL is required",
  //   })
  //   .url({ message: "Invalid url" }),
  // job_employment_type: z.string({
  //   required_error: "Employment type is required",
  // }),
  // job_compenstation_type: z.string({
  //   required_error: "Compensation type is required",
  // }),
  // job_salary_low: z.number().nonnegative().optional(),
  // job_salary_high: z.number().nonnegative().optional(),
  // job_description: z
  //   .string({
  //     required_error: "Job description is required",
  //   })
  //   .min(10, { message: "Must be 10 or more characters long" })
  //   .max(500, { message: "Must be 500 or less characters long" }),
  // user_first_name: z
  //   .string({
  //     required_error: "First name is required",
  //   })
  //   .min(2, { message: "Must be 2 or more characters long" })
  //   .max(20, { message: "Must be 20 or less characters long" }),
  // user_last_name: z
  //   .string({
  //     required_error: "Last name is required",
  //   })
  //   .min(2, { message: "Must be 2 or more characters long" })
  //   .max(20, { message: "Must be 20 or less characters long" }),
  // user_email: z
  //   .string({
  //     required_error: "Email is required",
  //   })
  //   .email()
  //   .min(2, { message: "Must be 2 or more characters long" })
  //   .max(40, { message: "Must be 40 or less characters long" }),
});

export function JobForm({ className, ...props }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    const createdOrganization = await SaveRecords(data);

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // redirect("https://buy.stripe.com/test_8wMcNtd0wcaYbSw000");
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-2 pb-4">
            <h1 className="text-2xl font-semibold tracking-tight">
              Tell us about your organization
            </h1>
            <p className="text-sm text-muted-foreground">
              We will automatically create a organization profile with all your
              job listings.
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
                      Provite the URL of your public job page or the email
                      address to redirect applicants to.
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
                      <Input disabled={isLoading} {...field} />
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
                      <Input disabled={isLoading} {...field} />
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
                name="user_password_confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

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
