import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { CircleChevronRight, Search, ChevronRight } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

import { findUserByClerkUserId } from "@/lib/models/User";
import Navigation from "@/components/Navigation";
import UserNavigation from "@/components/UserNavigation";
import Footer from "@/components/Footer";
import JobListItem from "@/components/JobListItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Pagination from "@/components/Pagination";

import client from "@/lib/database/client";

export const metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default async function Page({ params, searchParams }) {
  const { userId } = auth();
  let user = { organization: null };

  if (userId) {
    user = await findUserByClerkUserId(userId);
  }

  const industry = await client.jobIndustry.findUnique({
    where: {
      slug: params.industry,
    },
  });

  return (
    <main>
      <Header />
      <HeroSection />

      <div className="mx-auto max-w-7xl px-4 lg:px-0 pb-4 relative z-10 bg-white mb-32">
        <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-12">
          <div className="space-y-6 md:space-y-8 col-span-8">
            <div className="prose prose-lg dark:prose-invert">
              <JobListSection industry={industry} page={searchParams.page} />
            </div>
          </div>

          <Sidebar />
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

function HeroSection() {
  return (
    <div className="bg-white py-32 sm:py-48 lg:pt-32 lg:pb-24">
      <div className="lg:w-max-full mb-6 mt-20 flex flex-row items-center justify-between md:mb-8 lg:mt-8 xl:mx-auto xl:max-w-screen-xxl">
        <div className="hidden shrink lg:block">
          <img
            alt=""
            className="h-[180px] xl:h-[250px]"
            loading="lazy"
            src="https://wellfound.com/images/jobs/hero-1.png"
          />
        </div>
        <div className="w-full shrink-0 px-10 text-center lg:w-auto xl:px-12">
          <h1 className="mb-4 mt-6 text-xl font-medium uppercase tracking-widest lg:mb-3">
            Over 10k executive & management jobs
          </h1>
          <h2 className="text-2xl font-bold !leading-[1.2] md:mb-10 md:text-5xl xxl:text-[4.5rem]">
            Find what&apos;s next<span className="text-red-600">:</span>
          </h2>

          <SearchBar />
        </div>
        <div className="hidden shrink lg:block">
          <img
            alt=""
            className="h-[180px] xl:h-[250px]"
            loading="lazy"
            src="https://wellfound.com/images/jobs/hero-2.png"
          />
        </div>
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <div className="mt-10 w-full flex gap-x-6">
      <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
        <form>
          <div className="relative">
            <Search className="absolute left-4 top-4 mt-1 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="indent-5 px-6 py-7 text-base bg-white border-slate-900"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

async function JobListSection({ industry, page = 1 }) {
  const [results, meta] = await client.job
    .paginate({
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
    })
    .withPages({
      limit: 48,
      page: parseInt(page),
      includePageCount: true,
    });

  return (
    <JobsByIndustry
      key={industry.id}
      industry={industry}
      jobs={results}
      meta={meta}
    />
  );
}

function JobsByIndustry({ industry, jobs, meta }) {
  return (
    <div className="[&:not(:last-child)]:pb-16">
      <div className="pb-6 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
          {industry.name} Job Postings
        </h3>
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

      <Pagination metadata={meta} url={`/jobs/${industry.slug}`} />
    </div>
  );
}

function Sidebar() {
  return (
    <div className="sticky top-24 self-start space-y-6 md:space-y-8 h-fit col-span-4">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-top justify-start space-y-0 space-x-3 pb-4">
          <CardTitle className="text-lg font-semibold tracking-tight">
            Want more management jobs?
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 border-t border-slate-300">
          test
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-top justify-start space-y-0 space-x-3 pb-4">
          <CardTitle className="text-lg font-semibold tracking-tight">
            Want more management jobs?
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 border-t border-slate-300">
          test
        </CardContent>
      </Card>
    </div>
  );
}
