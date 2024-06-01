import Hero from "./Hero";
import Pagination from "./Pagination";
import Footer from "./Footer";

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

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <div className="pb-16 relative z-0">
        <Hero />
      </div>

      {/* Featured Jobs */}
      <div className="mx-auto max-w-7xl px-4 pb-16 relative z-10">
        <div className="pb-5 sm:flex sm:items-center sm:justify-between">
          <h3 className="text-2xl font-semibold leading-6 text-gray-900">
            Featured startups hiring now
          </h3>

          <div className="mt-3 flex sm:ml-4 sm:mt-0">
            <p className="truncate text-base text-gray-900 underline cursor-pointer hover:no-underline">
              Feature your company
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-md border border-gray-300 bg-white shadow-sm z-50"
            >
              <div className="relative flex items-center space-x-3 px-4 pt-4 bg-white rounded-md">
                <div className="flex-shrink-0">
                  <a href="#">
                    <img
                      className="h-12 w-12 rounded-lg"
                      src={featured.imageUrl}
                      alt=""
                    />
                  </a>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold leading-6 text-gray-900 hover:underline cursor-pointer">
                    {featured.name}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    1000-10,000 employees
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-900 px-4 pt-4">
                  Building awesome, scalable apps to power the future of tech
                </p>
              </div>

              <div className="pt-2 px-4 pt-5 pb-24">
                {Array.from({
                  length: Math.random() * (5 - 1) + 1,
                }).map((_, index) => (
                  <span
                    index={index}
                    className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mr-2"
                  >
                    Badge
                  </span>
                ))}
              </div>

              <div className="border-t border-gray-300">
                <a
                  href=""
                  className="text-sm text-gray-900 flex px-4 py-3 hover:bg-gray-100 hover:underline"
                >
                  12 open positions
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs */}
      <div className="mx-auto max-w-7xl px-4 pb-16 relative z-10 bg-white">
        <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-12">
          <div className="col-span-8">
            <div className="pb-5 sm:flex sm:items-center sm:justify-between">
              <h3 className="text-2xl font-semibold leading-6 text-gray-900">
                Trending Job Postings
              </h3>
              <div className="mt-3 flex sm:ml-4 sm:mt-0">
                <p className="truncate text-base text-gray-900 underline cursor-pointer hover:no-underline">
                  View all jobs
                </p>
              </div>
            </div>

            <ul role="list" className="divide-y divide-gray-200 pb-6">
              {Array.from({ length: 24 }).map((_, index) => (
                <li key={index} className="flex justify-between gap-x-6 py-4">
                  <div className="flex min-w-0 gap-x-4">
                    <a href="#">
                      <img
                        className="h-14 w-14 flex-none rounded-lg bg-gray-50"
                        src={person.imageUrl}
                        alt=""
                      />
                    </a>
                    <div className="min-w-0 flex-auto">
                      <p className="text-base font-semibold leading-6 text-gray-900 hover:underline cursor-pointer">
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

                      <div className="pt-2">
                        {Array.from({
                          length: Math.random() * (5 - 1) + 1,
                        }).map((_, index) => (
                          <span
                            index={index}
                            className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mr-2"
                          >
                            Badge
                          </span>
                        ))}
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

            <Pagination />
          </div>

          <div className="col-span-4 grid grid-cols-1 gap-6">
            <div className="pb-5 sm:flex sm:items-center sm:justify-between">
              <h3 className="text-2xl font-semibold leading-6 text-gray-900 invisible">
                Sidebar
              </h3>
            </div>
            <div className="relative flex items-center space-x-3 rounded-md border border-gray-200 bg-white px-6 py-5 shadow-sm">
              sdf
            </div>
            <div className="relative flex items-center space-x-3 rounded-md border border-gray-200 bg-white px-6 py-5 shadow-sm">
              sdf
            </div>
            <div className="relative flex items-center space-x-3 rounded-md border border-gray-200 bg-white px-6 py-5 shadow-sm">
              sdf
            </div>
          </div>
        </div>
      </div>

      {/* Signup CTA */}
      <div className="mx-auto max-w-7xl px-4 pb-16 relative z-10">
        <div className="bg-indigo-100 rounded-md">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to dive in?
              <br />
              Start your free trial today.
            </h2>
            <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
              <a
                href="#"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </a>
              <a
                href="#"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
