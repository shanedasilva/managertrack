import Link from "next/link";
import {
  Search,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  LayoutList,
  Clock10,
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

import Footer from "@/components/Footer";
import JobListItem from "@/components/JobListItem";
import Navigation from "@/components/Navigation";
import UserNavigation from "@/components/UserNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { getFeaturedOrganizations } from "@/lib/models/Organization";
import { getPopularIndustries } from "@/lib/models/Industry";
import { getJobsByIndustryId } from "@/lib/models/Job";

export default async function Page() {
  const featuredOrganizations = await getFeaturedOrganizations();

  return (
    <main>
      <Header />
      <HeroSection />
      <TrendingOrganizationsSection
        featuredOrganizations={featuredOrganizations}
      />

      <div className="mx-auto max-w-7xl px-4 pb-4 relative z-10 bg-white mb-32">
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
    <div className="text-center hidden md:block">
      <Button variant="ghost" asChild>
        <Link href="/examples/dashboard">
          Jobs <ChevronDown className="ml-1 h-4 w-4 ml-1" />
        </Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/examples/dashboard">Organizations</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/examples/dashboard">Advertise</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/examples/dashboard">
          More <ChevronDown className="ml-1 h-4 w-4 ml-1" />
        </Link>
      </Button>
    </div>
  );
}

function UserActions() {
  return (
    <div className="ml-auto flex items-center space-x-2 hidden md:block">
      <SignedIn>
        <UserNavigation />
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <Button variant="outline" asChild>
            <Link
              className="rounded bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 border-slate-900 hover:bg-slate-100"
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
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

function HeroSection() {
  return (
    <div className="bg-white py-16 lg:py-32 sm:py-48 lg:pt-32 lg:pb-24">
      <div className="lg:w-max-full mb-6 mt-10 lg:mt-20 flex flex-row items-center justify-between md:mb-8 lg:mt-8 xl:mx-auto xl:max-w-screen-xxl">
        <div className="hidden shrink lg:block">
          <img
            alt=""
            className="h-[180px] xl:h-[250px]"
            loading="lazy"
            src="https://wellfound.com/images/jobs/hero-1.png"
          />
        </div>

        <div className="w-full shrink-0 px-4 md:px-10 text-center lg:w-auto xl:px-12">
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
      <div className="bg-background/95 p-0 sm:p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
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
    <div className="mx-auto max-w-7xl px-4 pb-16 relative z-10">
      <div className="pb-6 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-xl font-semibold tracking-tight">
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
            <p className="text-lg font-semibold hover:underline cursor-pointer text-slate-900 truncate">
              {organization.name}
            </p>
          </Link>
          <p className="text-sm text-slate-900">+20.1% from last month</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base font-normal">
          Creating an open financial system for the world
        </p>
      </CardContent>
      <CardContent className="p-0 border-t border-slate-300">
        <Link
          className="px-5 py-3 block hover:bg-slate-100 rounded-b-md"
          href={`/organizations/${organization.slug}`}
        >
          <div className="flex justify-between items-center">
            <p className="text-sm font-normal">
              {organization._count.jobs} open positions
            </p>

            <ChevronRight className="ml-2 h-4 w-4" />
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

async function JobListSection() {
  const popularIndustries = await getPopularIndustries();

  return popularIndustries.map(async (industry) => {
    const jobs = await getJobsByIndustryId(industry.id);

    return <JobsByIndustry key={industry.id} industry={industry} jobs={jobs} />;
  });
}

function JobsByIndustry({ industry, jobs }) {
  return (
    <div className="[&:not(:last-child)]:pb-10 sm:[&:not(:last-child)]:pb-16">
      <div className="pb-6 sm:flex sm:items-center sm:justify-between border-b border-slate-300">
        <h3 className="text-lg md:text-xl font-semibold tracking-tight text-slate-900">
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

function Sidebar() {
  const features = [
    {
      name: "Quaility Job Listings.",
      description:
        "Only top quality management jobs. We screen, curate & categorize all jobs.",
      icon: LayoutList,
    },
    {
      name: "Advanced Search Filters.",
      description:
        "Find management jobs tailored to your location and experience. Entry level to executive. Startup to GAFAM.",
      icon: SlidersHorizontal,
    },
    {
      name: "Save Time.",
      description:
        "We spend the equivalent of 300+ hours/day scanning every job for you. Get a job faster with personalized job alerts.",
      icon: Clock10,
    },
  ];

  return (
    <div className="sticky top-24 self-start space-y-6 md:space-y-8 h-fit col-span-4">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-top justify-start space-y-0 space-x-3 pb-4">
          <CardTitle className="text-lg font-semibold tracking-tight">
            Search for jobs perfect for you
          </CardTitle>
        </CardHeader>

        <CardContent className="border-t border-slate-300 pb-0">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Filter by keyword</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Filter by location</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Filter by salary</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="w-full bg-slate-50">
        <CardHeader className="flex flex-row items-top justify-start space-y-0 space-x-3 pb-4">
          <CardTitle className="text-lg font-semibold tracking-tight">
            Upgrade to find your dream job
          </CardTitle>
        </CardHeader>

        <CardContent className="border-t border-slate-300 pt-5">
          <dl className="mb-6 max-w-xl space-y-4 text-sm leading-6 text-slate-900 lg:max-w-none">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-9">
                <dt className="inline font-semibold text-gray-900">
                  <feature.icon
                    aria-hidden="true"
                    className="absolute left-1 top-1 h-5 w-5 text-slate-900"
                  />
                  {feature.name}
                </dt>{" "}
                <dd className="inline">{feature.description}</dd>
              </div>
            ))}
          </dl>

          <Button asChild>
            <Link
              href="/jobs/new"
              className="w-full py-5 rounded-md text-sm font-medium transition-colors hover:text-primary"
            >
              Sign Up
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
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
