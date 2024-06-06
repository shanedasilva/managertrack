import { PlusIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { CircleChevronRight, Search } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import Footer from "@/components/Footer";
import FeaturedOrganization from "@/components/FeaturedOrganization";
import JobListItem from "@/components/JobListItem";
import Navigation from "@/components/Navigation";
import UserNavigation from "@/components/UserNavigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { getFeedJobs } from "@/lib/models/Job";
import { getFeaturedOrganizations } from "@/lib/models/Organization";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const avatartUrl =
  "https://pbs.twimg.com/profile_images/1641476962362302464/K8lb6OtN_400x400.jpg";

export default async function Page() {
  const jobs = await getFeedJobs();
  const featuredOrganizations = await getFeaturedOrganizations();

  return (
    <main>
      <div className="border-b fixed top-0 w-full bg-white z-50">
        <div className="grid gap-4 items-center md:grid-cols-2 lg:grid-cols-3 px-4 h-16">
          <Navigation />

          <div>
            <Button variant="ghost" asChild>
              <Link href="/examples/dashboard">Browse Jobs</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/examples/dashboard">Organizations</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/examples/dashboard">Advertise</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/examples/dashboard">More</Link>
            </Button>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <SignedIn>
              <UserNavigation />
            </SignedIn>

            <SignedOut>
              <SignInButton>
                <Button variant="outline" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </SignInButton>
            </SignedOut>

            <Button asChild>
              <Link
                href="/jobs/new"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Post a Job
                <CircleChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white mb-16">
        <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:pt-36 lg:pb-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Find your dream exec job without the hassle
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              ManagerTrack is where top executives go to easily access active
              and fully remote job opportunities from vetted tech companies.
            </p>
            <div className="mt-10 w-full flex gap-x-6">
              <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
                <form>
                  <div className="relative">
                    <Search className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search 200 management jobs"
                      className="indent-5 px-6 py-6 text-base bg-white"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeaturedOrganizationsSection
        featuredOrganizations={featuredOrganizations}
      />

      <div className="mx-auto max-w-7xl px-4 lg:px-0 pb-4 relative z-10 bg-white">
        <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-12">
          <div className="space-y-6 md:space-y-8 col-span-8">
            <div className="prose prose-lg dark:prose-invert">
              {Array.from({ length: 5 }).map((_, index) => (
                <div className="pb-12">
                  <div className="pb-6 sm:flex sm:items-center sm:justify-between">
                    <h3 className="text-2xl font-semibold tracking-tight">
                      Trending Job Postings
                    </h3>
                    <div className="mt-3 flex sm:ml-4 sm:mt-0">
                      <p className="truncate text-base text-gray-900 underline cursor-pointer hover:no-underline">
                        View all jobs
                      </p>
                    </div>
                  </div>

                  {jobs.map((job) => (
                    <div className="flex items-center border-b border-gray-300 pb-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={avatartUrl}
                          alt={job.organization.name}
                        />
                        <AvatarFallback>OM</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <Link href={`/job/${job.id}`}>
                          <p className="text-base font-bold leading-6 text-gray-900 hover:underline cursor-pointer">
                            {job.title}
                          </p>
                        </Link>

                        <div className=" flex items-center gap-x-1.5 text-xs">
                          <Link href={`/organization/${job.organization.id}`}>
                            <p className="truncate text-sm font-medium text-gray-900 hover:underline cursor-pointer">
                              {job.organization.name}
                            </p>
                          </Link>
                          <svg
                            viewBox="0 0 2 2"
                            className="h-1 w-1 text-gray-900 font-bold"
                          >
                            <circle cx={1} cy={1} r={1} />
                          </svg>
                          <p className="truncate text-sm text-gray-600">
                            {job.location}
                          </p>
                          <svg
                            viewBox="0 0 2 2"
                            className="h-0.5 w-0.5 text-gray-900"
                          >
                            <circle cx={1} cy={1} r={1} />
                          </svg>
                          <p className="truncate text-sm text-gray-600">
                            {formatter.format(job.payScaleBegin)} -{" "}
                            {formatter.format(job.payScaleEnd)}
                          </p>
                        </div>
                      </div>
                      <div className="ml-auto">
                        <div className="hidden shrink-0 sm:flex">
                          <div className="flex justify-between gap-x-2 align-middle py-2">
                            <div>
                              <button
                                type="button"
                                className="rounded bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-900 hover:bg-gray-50 mr-2"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                className="rounded bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="sticky top-24 self-start space-y-6 md:space-y-8 h-fit col-span-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Sidebar</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                This is the sidebar content. It will remain fixed in place as
                the user scrolls.
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold">Quick Links</h3>
              <nav className="mt-4 space-y-2">
                <Link
                  href="#"
                  className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 transition-colors"
                  prefetch={false}
                >
                  Link 1
                </Link>
                <Link
                  href="#"
                  className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 transition-colors"
                  prefetch={false}
                >
                  Link 2
                </Link>
                <Link
                  href="#"
                  className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 transition-colors"
                  prefetch={false}
                >
                  Link 3
                </Link>
                <Link
                  href="#"
                  className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 transition-colors"
                  prefetch={false}
                >
                  Link 4
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* <JobsSection jobs={jobs} /> */}

      <Footer />
    </main>
  );
}

/**
 * FeaturedOrganizationsSection component.
 *
 * @component
 * @returns {JSX.Element} JSX for the FeaturedOrganizationsSection component.
 */
function FeaturedOrganizationsSection({ featuredOrganizations }) {
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-0 pb-16 relative z-10">
      <div className="pb-6 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-2xl font-semibold tracking-tight">
          Featured organizations hiring now
        </h3>

        <div className="mt-3 flex sm:ml-4 sm:mt-0">
          <p className="truncate text-base text-gray-900 underline cursor-pointer hover:no-underline">
            Feature your organization
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {featuredOrganizations.map((organization) => (
          <Card index={organization.id}>
            <CardHeader className="flex flex-row items-top justify-start space-y-0 space-x-3 pb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={avatartUrl} alt="@shadcn" />
                <AvatarFallback>MT</AvatarFallback>
              </Avatar>

              <CardTitle>
                <div className="text-base font-semibold">
                  Amazon Web Services
                </div>
                <p className="text-sm">+20.1% from last month</p>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base font-normal">
                Creating an open financial system for the world
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * JobsSection component.
 *
 * @component
 * @returns {JSX.Element} JSX for the JobsSection component.
 */
function JobsSection({ jobs }) {
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-0 pb-4 relative z-10 bg-white">
      <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-12">
        <div className="col-span-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="pb-12">
              <div className="pb-6 sm:flex sm:items-center sm:justify-between">
                <h3 className="text-2xl font-semibold tracking-tight">
                  Trending Job Postings
                </h3>
                <div className="mt-3 flex sm:ml-4 sm:mt-0">
                  <p className="truncate text-base text-gray-900 underline cursor-pointer hover:no-underline">
                    View all jobs
                  </p>
                </div>
              </div>

              {jobs.map((job) => (
                <div className="flex items-center border-b border-gray-300 pb-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={avatartUrl} alt={job.organization.name} />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <Link href={`/job/${job.id}`}>
                      <p className="text-base font-bold leading-6 text-gray-900 hover:underline cursor-pointer">
                        Machine Learning Engineer
                      </p>
                    </Link>

                    <div className=" flex items-center gap-x-1.5 text-xs">
                      <Link href={`/organization/${job.organization.id}`}>
                        <p className="truncate text-sm font-medium text-gray-900 hover:underline cursor-pointer">
                          {job.organization.name}
                        </p>
                      </Link>
                      <svg
                        viewBox="0 0 2 2"
                        className="h-1 w-1 text-gray-900 font-bold"
                      >
                        <circle cx={1} cy={1} r={1} />
                      </svg>
                      <p className="truncate text-sm text-gray-500">
                        {job.location}
                      </p>
                      <svg
                        viewBox="0 0 2 2"
                        className="h-0.5 w-0.5 text-gray-900"
                      >
                        <circle cx={1} cy={1} r={1} />
                      </svg>
                      <p className="truncate text-sm text-gray-500">
                        {formatter.format(job.payScaleBegin)} -{" "}
                        {formatter.format(job.payScaleEnd)}
                      </p>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <div className="hidden shrink-0 sm:flex">
                      <div className="flex justify-between gap-x-2 align-middle py-2">
                        <div>
                          <button
                            type="button"
                            className="rounded bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-900 hover:bg-gray-50 mr-2"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="rounded bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="col-span-4 grid grid-cols-1 gap-6">
          <div className="pb-5 sm:flex sm:items-center sm:justify-between">
            <h3 className="text-2xl font-semibold tracking-tight">Filters</h3>
            <div className="mt-3 flex sm:ml-4 sm:mt-0">
              <p className="truncate text-base text-gray-900">182 Results</p>
            </div>
          </div>

          <aside className="relative sticky top-4 self-start">
            <h2 className="sr-only">Filters</h2>

            <button
              type="button"
              className="inline-flex items-center lg:hidden"
            >
              <span className="text-sm font-medium text-gray-700">Filters</span>
              <PlusIcon
                className="ml-1 h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
            </button>

            <div className="hidden lg:block">
              <Card>
                <CardHeader>
                  <CardTitle>Create project</CardTitle>
                  <CardDescription>
                    Deploy your new project in one-click.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Name of your project" />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="framework">Framework</Label>
                        <Select>
                          <SelectTrigger id="framework">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="next">Next.js</SelectItem>
                            <SelectItem value="sveltekit">SvelteKit</SelectItem>
                            <SelectItem value="astro">Astro</SelectItem>
                            <SelectItem value="nuxt">Nuxt.js</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button>Deploy</Button>
                </CardFooter>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
