import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { CircleChevronRight, ChevronRight } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

import { findUserByClerkUserId } from "@/lib/models/User";
import { getSingleJobBySlug } from "@/lib/models/Job";
import Navigation from "@/components/Navigation";
import JobListItem from "@/components/JobListItem";
import UserNavigation from "@/components/UserNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import client from "@/lib/database/client";

export const metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

function createMarkup(markup) {
  const htmlContent = markup.replace(/<p><\/p>/g, "").replace(/&nbsp;/g, "");

  return { __html: htmlContent };
}

export default async function Page({ params }) {
  const { userId } = auth();
  let user = { organization: null };

  if (userId) {
    user = await findUserByClerkUserId(userId);
  }

  const job = await getSingleJobBySlug(params.job);

  return (
    <main>
      <Header />

      <div className="mx-auto max-w-full px-4 lg:px-0 relative z-10 bg-white pt-16">
        <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-12 divide-x divide-slate-300">
          <div className="sticky top-16 self-start space-y-6 md:space-y-8 h-fit col-span-4 px-12 py-12">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/jobs/${job.industry.slug}`}>
                    {job.industry.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              {job.title}
            </h1>
          </div>

          <div className="space-y-6 md:space-y-8 col-span-8 py-12">
            <div className="prose prose-lg dark:prose-invert px-36">
              <div
                className="job-description pb-16"
                dangerouslySetInnerHTML={createMarkup(job.description)}
              />

              <JobListSection industryId={params.industry} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function Header() {
  return (
    <div className="border-b border-slate-300 fixed top-0 w-full bg-white z-50">
      <div className="grid gap-4 items-center md:grid-cols-2 lg:grid-cols-3 px-4 h-16">
        <Navigation />
        <NavLinks />
        <UserActions />
      </div>
    </div>
  );
}

function NavLinks() {
  return (
    <div className="text-center">
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
  );
}

function UserActions() {
  return (
    <div className="ml-auto flex items-center space-x-2">
      <SignedIn>
        <UserNavigation />
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <Button variant="outline" asChild>
            <Link
              className="rounded bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 border-slate-900 hover:bg-slate-100"
              href="/login"
            >
              Sign In
            </Link>
          </Button>
        </SignInButton>
      </SignedOut>
      <Button asChild>
        <Link
          href="/jobs/new"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Post a Job
          <CircleChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

async function JobListSection({ industryId }) {
  const industry = await client.jobIndustry.findUnique({
    where: {
      slug: industryId,
    },
  });

  const jobs = await client.job.findMany({
    where: {
      industryId: industry.id,
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoURL: true,
        },
      },
      city: {
        select: {
          id: true,
          name: true,
          slug: true,
          country: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: [
      {
        activeUntil: "desc",
      },
      {
        payScaleBegin: { sort: "desc", nulls: "last" },
      },
      {
        payScaleEnd: { sort: "desc", nulls: "last" },
      },
    ],
    take: 4,
  });

  return <JobsByIndustry key={industry.id} industry={industry} jobs={jobs} />;
}

function JobsByIndustry({ industry, jobs }) {
  return (
    <div className="[&:not(:last-child)]:pb-16">
      <div className="pb-6 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
          {industry.name} Job Postings
        </h3>
        <div className="mt-3 flex sm:ml-4 sm:mt-0">
          <Link
            className="truncate flex justify-between items-center font-medium text-sm text-slate-900 cursor-pointer"
            href={`/jobs/${industry.slug}`}
          >
            View more
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
      <ul
        role="list"
        className="divide-y divide-slate-300 border-b border-slate-300"
      >
        {jobs.map((job) => (
          <JobListItem
            avatarUrl={job.organization.logoURL}
            industry={industry}
            job={job}
            key={job.id}
          />
        ))}
      </ul>
    </div>
  );
}
