import Link from "next/link";
import {
  ChevronRight,
  SlidersHorizontal,
  LayoutList,
  Clock10,
} from "lucide-react";

import JobListItem from "@/components/JobListItem";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OrganizationCard from "@/components/OrganizationCard";
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
      <Hero />
      <TrendingOrganizations featuredOrganizations={featuredOrganizations} />

      <div className="mx-auto max-w-7xl px-4 pb-4 relative z-10 bg-white mb-16 lg:mb-32">
        <div className="mx-auto lg:grid grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-12">
          <div className="space-y-6 md:space-y-8 col-span-8">
            <div className="prose prose-lg dark:prose-invert">
              <IndustryJobList />
            </div>
          </div>

          <Sidebar />
        </div>
      </div>

      <Footer />
    </main>
  );
}

function TrendingOrganizations({ featuredOrganizations }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 relative z-10">
      <div className="pb-6 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-xl font-semibold tracking-tight">
          Trending organizations hiring now
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {featuredOrganizations.map((organization) => (
          <OrganizationCard key={organization.id} organization={organization} />
        ))}
      </div>
    </div>
  );
}

async function IndustryJobList() {
  const popularIndustries = await getPopularIndustries();

  return popularIndustries.map(async (industry) => {
    const jobs = await getJobsByIndustryId(industry.id);

    return (
      <ListOfIndustryJobs key={industry.id} industry={industry} jobs={jobs} />
    );
  });
}

function ListOfIndustryJobs({ industry, jobs }) {
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
    <div className="lg:sticky top-24 self-start space-y-6 md:space-y-8 h-fit col-span-4 mt-8 lg:mt-0">
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
                <dt className="inline font-semibold text-slate-900">
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
