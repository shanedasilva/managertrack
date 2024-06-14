import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

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
export default function JobListItem({ avatarUrl, industry, job }) {
  return (
    <li key={job.id} className="flex justify-between gap-x-6 py-4 align-middle">
      <div className="flex min-w-0 gap-x-4">
        <div className="h-12 w-12 rounded-lg relative">
          <Link href={`/jobs/${industry.slug}/${job.slug}`}>
            <Image
              alt={job.title}
              className="rounded-lg"
              fill={true}
              src={avatarUrl}
              style={{ objectFit: "cover" }}
            />
          </Link>
        </div>

        <div className="min-w-0 flex-auto text-slate-900">
          <Link href={`/jobs/${industry.slug}/${job.slug}`}>
            <p className="text-lg font-semibold leading-6 hover:underline cursor-pointer">
              {job.title}
            </p>
          </Link>
          <div className="mt-1 flex items-center gap-x-1.5 text-xs">
            <Link href={`/organizations/${job.organization.slug}`}>
              <p className="truncate text-sm font-medium hover:underline cursor-pointer">
                {job.organization.name}
              </p>
            </Link>
            <svg viewBox="0 0 2 2" className="h-0.5 w-0.5">
              <circle cx={1} cy={1} r={1} />
            </svg>
            {job.city && job.city.country && (
              <>
                <Link
                  className="truncate text-sm text-slate-500 hover:underline"
                  href={`/jobs/${industry.slug}/${job.city.id}`}
                >
                  {job.city.name}, {job.city.country.name}
                </Link>
                <svg viewBox="0 0 2 2" className="h-0.5 w-0.5">
                  <circle cx={1} cy={1} r={1} />
                </svg>
              </>
            )}

            <p className="truncate text-sm text-slate-500">
              {formatter.format(job.payScaleBegin)} -{" "}
              {formatter.format(job.payScaleEnd)}
            </p>
          </div>
        </div>
      </div>

      <div className="hidden shrink-0 sm:flex">
        <div className="flex justify-between gap-x-2 align-middle">
          <div className="pt-1.5">
            <button
              type="button"
              className="rounded bg-white px-5 py-1.5 text-sm font-semibold text-gray-900 border border-slate-900 hover:bg-slate-100 mr-2"
            >
              Save
            </button>

            <Button
              className="rounded bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-slate-600"
              variant="ghost"
              asChild
            >
              <Link href={job.applyURL} target="_blank">
                Apply
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}
