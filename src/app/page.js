import Link from "next/link";
import { CircleChevronRight, Search } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

import Footer from "@/components/Footer";
import JobListItem from "@/components/JobListItem";
import Navigation from "@/components/Navigation";
import UserNavigation from "@/components/UserNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

import { getFeedJobs } from "@/lib/models/Job";
import { getFeaturedOrganizations } from "@/lib/models/Organization";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const avatarUrl =
  "https://pbs.twimg.com/profile_images/1641476962362302464/K8lb6OtN_400x400.jpg";

export default async function Page() {
  const jobs = await getFeedJobs();
  const featuredOrganizations = await getFeaturedOrganizations();

  return (
    <main>
      <Header />
      <HeroSection />
      <FeaturedOrganizationsSection
        featuredOrganizations={featuredOrganizations}
      />
      <JobListSection jobs={jobs} />
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <div className="border-b fixed top-0 w-full bg-[#FFF8F5] z-50">
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
  );
}

function UserActions() {
  return (
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
          href="/management-jobs/new"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Post a Job
          <CircleChevronRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

function HeroSection() {
  return (
    <div className="bg-[#FFF8F5] mb-16">
      <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:pt-36 lg:pb-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Find your dream exec job without the hassle
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            ManagerTrack is where top executives go to easily access active and
            fully remote job opportunities from vetted tech companies.
          </p>
          <SearchBar />
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
            <Search className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search 200 management jobs"
              className="indent-5 px-6 py-6 text-base bg-white"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

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
          <FeaturedOrganizationCard
            key={organization.id}
            organization={organization}
          />
        ))}
      </div>
    </div>
  );
}

function FeaturedOrganizationCard({ organization }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-top justify-start space-y-0 space-x-3 pb-4">
        <Link href={`/organizations/${organization.slug}`}>
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatarUrl} alt={organization.name} />
            <AvatarFallback>MT</AvatarFallback>
          </Avatar>
        </Link>
        <CardTitle>
          <Link href={`/organizations/${organization.slug}`}>
            <p className="text-base font-semibold hover:underline cursor-pointer">
              {organization.name}
            </p>
          </Link>
          <p className="text-sm">+20.1% from last month</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base font-normal">
          Creating an open financial system for the world
        </p>
      </CardContent>
    </Card>
  );
}

function JobListSection({ jobs }) {
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-0 pb-4 relative z-10 bg-white">
      <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-12">
        <div className="space-y-6 md:space-y-8 col-span-8">
          <div className="prose prose-lg dark:prose-invert">
            {Array.from({ length: 5 }).map((_, index) => (
              <TrendingJobPostings key={index} jobs={jobs} />
            ))}
          </div>
        </div>
        <Sidebar />
      </div>
    </div>
  );
}

function TrendingJobPostings({ jobs }) {
  return (
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
        <JobListItem
          key={job.id}
          job={job}
          formatter={formatter}
          avatarUrl={avatarUrl}
        />
      ))}
    </div>
  );
}

function Sidebar() {
  return (
    <div className="sticky top-24 self-start space-y-6 md:space-y-8 h-fit col-span-4">
      <div>
        <h2 className="text-xl md:text-2xl font-bold">Sidebar</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          This is the sidebar content. It will remain fixed in place as the user
          scrolls.
        </p>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold">Quick Links</h3>
        <nav className="mt-4 space-y-2">
          <Link
            href="#"
            className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 transition-colors"
          >
            Link 1
          </Link>
          <Link
            href="#"
            className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 transition-colors"
          >
            Link 2
          </Link>
          <Link
            href="#"
            className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 transition-colors"
          >
            Link 3
          </Link>
        </nav>
      </div>
    </div>
  );
}
