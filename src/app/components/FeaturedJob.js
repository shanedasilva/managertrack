import Image from "next/image";

/**
 * Renders a featured job.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.job - The job object containing details.
 * @param {string} props.job.name - The name of the job.
 * @param {string} props.job.imageUrl - The URL of the job image.
 * @returns {JSX.Element} - The JSX for the featured job.
 */
export default function FeaturedJob({ job }) {
  return (
    <div className="rounded-md border border-gray-300 bg-white shadow-sm z-50">
      <div className="relative flex items-center space-x-3 px-4 pt-4 bg-white rounded-md">
        <div className="flex-shrink-0 h-12 w-12 rounded-lg relative">
          <a href="#">
            <Image
              alt={job.name}
              className="rounded-lg"
              layout="fill"
              src={job.imageUrl}
              style={{ objectFit: "cover" }}
            />
          </a>
        </div>

        <JobHeader name={job.name} />
      </div>

      <JobDescription />
      <JobFooter />
    </div>
  );
}

/**
 * Renders the job name and employee count.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.name - The name of the job.
 * @returns {JSX.Element} - The JSX for the job header.
 */
function JobHeader({ name }) {
  return (
    <div>
      <p className="text-base font-medium leading-6 text-gray-900 hover:underline cursor-pointer">
        {name}
      </p>

      <p className="truncate text-sm text-gray-500">1000-10,000 employees</p>
    </div>
  );
}

/**
 * Renders the job description.
 *
 * @returns {JSX.Element} - The JSX for the job description.
 */
function JobDescription() {
  return (
    <p className="text-sm text-gray-900 px-4 pt-4">
      Building awesome, scalable apps to power the future of tech
    </p>
  );
}

/**
 * Renders the number of open positions.
 *
 * @returns {JSX.Element} - The JSX for the job footer.
 */
function JobFooter() {
  return (
    <div className="border-t border-gray-300">
      <a
        href=""
        className="text-sm text-gray-900 flex px-4 py-3 hover:bg-gray-100 hover:underline"
      >
        12 open positions
      </a>
    </div>
  );
}
