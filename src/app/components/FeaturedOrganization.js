import Image from "next/image";
import Link from "next/link";

const avatartUrl =
  "https://pbs.twimg.com/profile_images/1641476962362302464/K8lb6OtN_400x400.jpg";

/**
 * Renders a featured organization.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.job - The job object containing details.
 * @param {string} props.job.name - The name of the job.
 * @param {string} props.job.imageUrl - The URL of the job image.
 * @returns {JSX.Element} - The JSX for the featured job.
 */
export default function FeaturedOrganization({ organization }) {
  return (
    <div className="rounded-md border border-gray-300 bg-white shadow-sm z-50">
      <div className="relative flex items-center space-x-3 px-4 pt-4 bg-white rounded-md">
        <div className="flex-shrink-0 h-12 w-12 rounded-lg relative">
          <Link href={`/organization/${organization.id}`}>
            <Image
              alt={organization.name}
              className="rounded-lg"
              layout="fill"
              src={avatartUrl}
              style={{ objectFit: "cover" }}
            />
          </Link>
        </div>

        <JobHeader name={organization.name} />
      </div>

      <JobDescription />

      <JobFooter
        organizationId={organization.id}
        jobCount={organization._count.Job}
      />
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
    <p className="text-sm text-gray-900 px-4 pt-4 pb-12">
      Building awesome, scalable apps to power the future of tech
    </p>
  );
}

/**
 * Renders the number of open positions.
 *
 * @returns {JSX.Element} - The JSX for the job footer.
 */
function JobFooter({ organizationId, jobCount }) {
  return (
    <div className="border-t border-gray-300">
      <Link
        href={`/organization/${organizationId}`}
        className="text-sm text-gray-900 flex px-4 py-3 hover:bg-gray-100 hover:underline"
      >
        {jobCount} open position {jobCount > 1 ? "s" : ""}
      </Link>
    </div>
  );
}
