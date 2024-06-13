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

import { getFeaturedOrganizations } from "@/lib/models/Organization";

import client from "@/lib/database/client";

import {
  fetchJobRegions,
  fetchJobCountries,
  fetchJobCities,
  fetchJobIndustries,
  fetchJobTypes,
  fetchOrganizationTypes,
  fetchOrganizations,
  fetchJobs,
} from "@/lib/backfill";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default async function Page() {
  const featuredOrganizations = await getFeaturedOrganizations();

  // await fetchJobRegions();
  // await fetchJobCountries();
  // await fetchJobCities();
  // await fetchJobIndustries();
  // await fetchJobTypes();
  // await fetchOrganizationTypes();
  // await fetchOrganizations();
  // await fetchJobs();

  return (
    <main>
      <Header />
      <HeroSection />
      <TrendingOrganizationsSection
        featuredOrganizations={featuredOrganizations}
      />

      <div className="mx-auto max-w-7xl px-4 lg:px-0 pb-4 relative z-10 bg-white">
        <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-12">
          <div className="space-y-6 md:space-y-8 col-span-8">
            <div className="prose prose-lg dark:prose-invert">
              <JobListSection />
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
    <div className="border-b fixed top-0 w-full bg-white z-50">
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
    <div className="bg-white py-32 sm:py-48 lg:pt-24 lg:pb-10">
      <div className="lg:w-max-full mb-6 mt-20 flex flex-row items-center justify-between md:mb-8 lg:mt-8 xl:mx-auto xl:max-w-screen-xxl">
        <div className="hidden shrink lg:block">
          <img
            alt=""
            className="h-[180px] xl:h-[250px]"
            loading="lazy"
            src="https://wellfound.com/images/jobs/hero-1.png"
          />
        </div>
        <div className="w-full shrink-0 px-10 text-center lg:w-auto xl:px-20">
          <h1 className="mb-4 mt-6 text-2xl font-medium uppercase tracking-widest lg:mb-6">
            Over 3k executive & management jobs
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
              className="indent-5 px-6 py-7 text-base bg-white border-gray-900"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

function TrendingOrganizationsSection({ featuredOrganizations }) {
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-0 pb-16 relative z-10">
      <div className="pb-6 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-2xl font-semibold tracking-tight">
          Trending organizations hiring now
        </h3>
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
            <AvatarImage src={organization.logoURL} alt={organization.name} />
            <AvatarFallback>MT</AvatarFallback>
          </Avatar>
        </Link>
        <CardTitle>
          <Link href={`/organizations/${organization.slug}`}>
            <p className="text-lg font-semibold hover:underline cursor-pointer">
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

async function JobListSection() {
  const popularIndustries = await client.jobIndustry.findMany({
    take: 8,
    orderBy: {
      jobs: {
        _count: "desc",
      },
    },
  });

  return popularIndustries.map(async (industry) => {
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
          },
        },
      },
      take: 6,
    });

    return <JobsByIndustry key={industry.id} industry={industry} jobs={jobs} />;
  });
}

function JobsByIndustry({ industry, jobs }) {
  return (
    <div className="pb-8">
      <div className="pb-6 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-2xl font-semibold tracking-tight">
          Trending {industry.name} Job Postings
        </h3>
        <div className="mt-3 flex sm:ml-4 sm:mt-0">
          <Link
            className="truncate text-base text-gray-900 underline cursor-pointer hover:no-underline"
            href={`/remote-jobs/${industry.id}`}
          >
            View more
          </Link>
        </div>
      </div>
      <ul role="list" className="divide-y divide-gray-300">
        {jobs.map((job) => (
          <JobListItem
            key={job.id}
            job={job}
            formatter={formatter}
            avatarUrl={job.organization.logoURL}
          />
        ))}
      </ul>
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

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_APP_URL),
  openGraph: {
    siteName: "Blog | ManagerTrack",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: "index, follow",
  },
  alternates: {
    types: {
      "application/rss+xml": `${process.env.NEXT_PUBLIC_BASE_APP_URL}/rss.xml`,
    },
  },
  applicationName: "ManagerTrack",
  appleWebApp: {
    title: "ManagerTrack",
    statusBarStyle: "default",
    capable: true,
  },
  verification: {
    google: "YOUR_DATA",
    yandex: ["YOUR_DATA"],
    other: {
      "msvalidate.01": ["YOUR_DATA"],
      "facebook-domain-verification": ["YOUR_DATA"],
    },
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      // add favicon-32x32.png, favicon-96x96.png, android-chrome-192x192.png
    ],
    shortcut: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
    apple: [
      {
        url: "/apple-icon-57x57.png",
        sizes: "57x57",
        type: "image/png",
      },
      {
        url: "/apple-icon-60x60.png",
        sizes: "60x60",
        type: "image/png",
      },
      // add apple-icon-72x72.png, apple-icon-76x76.png, apple-icon-114x114.png, apple-icon-120x120.png, apple-icon-144x144.png, apple-icon-152x152.png, apple-icon-180x180.png
    ],
  },
};
