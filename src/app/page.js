import { PlusIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Script from "next/script";

import Hero from "../components/Hero";
import Footer from "../components/Footer";
import FeaturedJob from "../components/FeaturedJob";

const person = {
  name: "Software Development Manager",
  company: "Amazon Web Services",
  role: "Fulltime",
  location: "Remote (PST)",
  salary: "$275,000 CAD",
  imageUrl:
    "https://pbs.twimg.com/profile_images/1641476962362302464/K8lb6OtN_400x400.jpg",
};

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

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <div className="pb-16 relative z-0">
        <Hero />
      </div>

      {/* Featured Jobs */}
      <div className="mx-auto max-w-7xl px-4 lg:px-0 pb-16 relative z-10">
        <div className="pb-5 sm:flex sm:items-center sm:justify-between">
          <h3 className="text-2xl font-medium leading-6 text-gray-900">
            Featured companies hiring now
          </h3>

          <div className="mt-3 flex sm:ml-4 sm:mt-0">
            <p className="truncate text-base text-gray-900 underline cursor-pointer hover:no-underline">
              Feature your company
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <FeaturedJob index={Math.random()} job={featured} />
          ))}
        </div>
      </div>

      {/* Jobs */}
      <div className="mx-auto max-w-7xl px-4 lg:px-0 pb-4 relative z-10 bg-white">
        <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-12">
          <div className="col-span-9">
            {Array.from({ length: 5 }).map((_, index) => (
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
                  {Array.from({ length: 8 }).map((_, index) => (
                    <li
                      key={Math.random()}
                      className="flex justify-between gap-x-6 py-3"
                    >
                      <div className="flex min-w-0 gap-x-4">
                        <div className="h-12 w-12 rounded-lg relative">
                          <a href="#">
                            <Image
                              alt={person.name}
                              className="rounded-lg"
                              fill={true}
                              src={person.imageUrl}
                              style={{ objectFit: "cover" }}
                            />
                          </a>
                        </div>
                        <div className="min-w-0 flex-auto">
                          <p className="text-base font-medium leading-6 text-gray-900 hover:underline cursor-pointer">
                            {person.name}
                          </p>
                          <div className="mt-1 flex items-center gap-x-1.5 text-xs">
                            <p className="truncate text-sm text-gray-900 hover:underline cursor-pointer">
                              {person.company}
                            </p>
                            <svg
                              viewBox="0 0 2 2"
                              className="h-0.5 w-0.5 text-gray-900"
                            >
                              <circle cx={1} cy={1} r={1} />
                            </svg>
                            <p className="truncate text-sm text-gray-500">
                              {person.location}
                            </p>
                            <svg
                              viewBox="0 0 2 2"
                              className="h-0.5 w-0.5 text-gray-900"
                            >
                              <circle cx={1} cy={1} r={1} />
                            </svg>
                            <p className="truncate text-sm text-gray-500">
                              {person.salary}
                            </p>
                          </div>
                        </div>
                      </div>
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
                    </li>
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
                <span className="text-sm font-medium text-gray-700">
                  Filters
                </span>
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

      {/* Footer */}
      <Footer />

      <Script src="https://cloud.umami.is/script.js" />
    </main>
  );
}
