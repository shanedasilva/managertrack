import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { CircleChevronRight } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

import { findUserByClerkUserId } from "@/lib/models/User";
import { getSingleJobBySlug } from "@/lib/models/Job";
import Navigation from "@/components/Navigation";
import UserNavigation from "@/components/UserNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

function createMarkup(markup) {
  return { __html: markup };
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

      <div className="mx-auto max-w-full px-4 lg:px-0 pb-4 relative z-10 bg-white pt-16 mb-32">
        <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-12 divide-x divide-slate-300">
          <div className="sticky top-24 self-start space-y-6 md:space-y-8 h-fit col-span-4 px-12 py-4">
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

          <div className="space-y-6 md:space-y-8 col-span-8">
            <div className="prose prose-lg dark:prose-invert px-36 py-16">
              <div dangerouslySetInnerHTML={createMarkup(job.description)} />
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
          <CircleChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
