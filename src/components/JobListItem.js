import Image from "next/image";
import Link from "next/link";

const AVATAR_URL =
  "https://pbs.twimg.com/profile_images/1641476962362302464/K8lb6OtN_400x400.jpg";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/**
 * Renders a JobList job.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.job - The job object containing details.
 * @param {string} props.job.name - The name of the job.
 * @param {string} props.job.imageUrl - The URL of the job image.
 * @returns {JSX.Element} - The JSX for the featured job.
 */
export default function JobListItem({ job }) {
  return (
    <li key={job.id} className="flex justify-between gap-x-6 py-3">
      <div className="flex min-w-0 gap-x-4">
        <div className="h-12 w-12 rounded-lg relative">
          <Link href={`/jobs/${job.slug}`}>
            <Image
              alt={job.title}
              className="rounded-lg"
              fill={true}
              src={AVATAR_URL}
              style={{ objectFit: "cover" }}
            />
          </Link>
        </div>

        <div className="min-w-0 flex-auto">
          <Link href={`/jobs/${job.slug}`}>
            <p className="text-lg font-semibold leading-6 text-gray-900 hover:underline cursor-pointer">
              {job.title}
            </p>
          </Link>
          <div className="mt-1 flex items-center gap-x-1.5 text-xs">
            <Link href={`/organizations/${job.organization.slug}`}>
              <p className="truncate text-sm text-gray-900 hover:underline cursor-pointer">
                {job.organization.name}
              </p>
            </Link>
            <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 text-gray-900">
              <circle cx={1} cy={1} r={1} />
            </svg>
            <p className="truncate text-sm text-gray-500">{job.location}</p>
            <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 text-gray-900">
              <circle cx={1} cy={1} r={1} />
            </svg>
            <p className="truncate text-sm text-gray-500">
              {formatter.format(job.payScaleBegin)} -{" "}
              {formatter.format(job.payScaleEnd)}
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
  );
}
