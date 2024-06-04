import { PlusIcon } from "@heroicons/react/20/solid";
import Script from "next/script";
import { auth } from "@clerk/nextjs/server";
import { SignInButton, SignOutButton } from "@clerk/nextjs";

import Hero from "./components/Hero";
import Footer from "./components/Footer";
import FeaturedOrganization from "./components/FeaturedOrganization";
import JobListItem from "./components/JobListItem";

import { GetFeedJobs } from "../lib/models/Job";
import { GetFeaturedOrganizations } from "../lib/models/Organization";

const featured = {
  name: "Amazon Web Services",
  email: "leslie.alexander@example.com",
  role: "Co-Founder / CEO",
  imageUrl:
    "https://pbs.twimg.com/profile_images/1641476962362302464/K8lb6OtN_400x400.jpg",
};

const filters = [
  {
    id: "location",
    name: "Location",
    options: [
      { value: "white", label: "White" },
      { value: "beige", label: "Beige" },
      { value: "blue", label: "Blue" },
      { value: "brown", label: "Brown" },
      { value: "green", label: "Green" },
      { value: "purple", label: "Purple" },
    ],
  },
  {
    id: "function",
    name: "Function",
    options: [
      { value: "new-arrivals", label: "All New Arrivals" },
      { value: "tees", label: "Tees" },
      { value: "crewnecks", label: "Crewnecks" },
      { value: "sweatshirts", label: "Sweatshirts" },
      { value: "pants-shorts", label: "Pants & Shorts" },
    ],
  },
  {
    id: "job_type",
    name: "Job Type",
    options: [
      { value: "fulltime", label: "Full-Time" },
      { value: "parttime", label: "Part-Time" },
      { value: "board", label: "Board Role" },
      { value: "contractor", label: "Interm/Contractor" },
    ],
  },
  {
    id: "level",
    name: "Level",
    options: [
      { value: "c_level", label: "C-Level" },
      { value: "vice_president", label: "Vice President" },
      { value: "general_counsel", label: "General Counsel" },
      { value: "director", label: "Director" },
    ],
  },
  {
    id: "workplace_type",
    name: "Workplace Type",
    options: [
      { value: "remote", label: "Remote" },
      { value: "hybrid", label: "Hybrid" },
      { value: "onsite", label: "On-site" },
    ],
  },
  {
    id: "company_size",
    name: "Company Size",
    options: [
      { value: "remote", label: "1-10" },
      { value: "onsite", label: "11-50" },
      { value: "onsite", label: "51-200" },
      { value: "onsite", label: "201-500" },
      { value: "onsite", label: "501-1000" },
      { value: "onsite", label: "1001-5000" },
      { value: "onsite", label: "5001-10,000" },
      { value: "onsite", label: "10,000+" },
    ],
  },
];

export default async function Page() {
  const { userId } = auth();
  const jobs = await GetFeedJobs();
  const featuredOrganizations = await GetFeaturedOrganizations();

  return (
    <main>
      <div className="pb-16 relative z-0">
        {userId !== null ? <SignOutButton /> : <SignInButton />}
        <Hero />
      </div>

      <FeaturedOrganizationsSection
        featuredOrganizations={featuredOrganizations}
      />

      <JobsSection jobs={jobs} />

      <Footer />

      {/* Umami Analytics */}
      <Script src="https://cloud.umami.is/script.js" />
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
      <div className="pb-5 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-2xl font-medium leading-6 text-gray-900">
          Featured organizations hiring now
        </h3>

        <div className="mt-3 flex sm:ml-4 sm:mt-0">
          <p className="truncate text-base text-gray-900 underline cursor-pointer hover:no-underline">
            Feature your organization
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {featuredOrganizations.map((organization) => (
          <FeaturedOrganization organization={organization} />
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
        <div className="col-span-9">
          {Array.from({ length: 1 }).map((_, index) => (
            <div className="pb-6">
              <div className="pb-5 sm:flex sm:items-center sm:justify-between">
                <h3 className="text-2xl font-medium leading-6 text-gray-900">
                  Trending Job Postings
                </h3>
                <div className="mt-3 flex sm:ml-4 sm:mt-0">
                  <p className="truncate text-base text-gray-900 underline cursor-pointer hover:no-underline">
                    View all jobs
                  </p>
                </div>
              </div>

              <ul role="list" className="divide-y divide-gray-300 pb-6">
                {jobs.map((job) => (
                  <JobListItem job={job} />
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="col-span-3 grid grid-cols-1 gap-6">
          <div className="pb-5 sm:flex sm:items-center sm:justify-between">
            <h3 className="text-2xl font-semibold leading-6 text-gray-900">
              Filters
            </h3>
            <div className="mt-3 flex sm:ml-4 sm:mt-0">
              <p className="truncate text-base text-gray-900">182 Results</p>
            </div>
          </div>

          <aside>
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
              <form className="space-y-6 divide-y divide-gray-300">
                {filters.map((section, sectionIdx) => (
                  <div
                    key={Math.random()}
                    className={sectionIdx === 0 ? null : "pt-6"}
                  >
                    <fieldset>
                      <legend className="block text-base font-medium text-gray-900">
                        {section.name}
                      </legend>
                      <div className="space-y-3 pt-6">
                        {section.options.map((option, optionIdx) => (
                          <div
                            key={Math.random()}
                            className="flex items-center"
                          >
                            <input
                              id={`${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              defaultValue={option.value}
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-900 text-gray-900 focus:ring-gray-900"
                            />
                            <label
                              htmlFor={`${section.id}-${optionIdx}`}
                              className="ml-3 text-sm text-gray-900"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                ))}
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
