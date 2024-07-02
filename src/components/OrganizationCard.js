import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

/**
 * Renders a featured organization.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.job - The job object containing details.
 * @param {string} props.job.name - The name of the job.
 * @param {string} props.job.imageUrl - The URL of the job image.
 * @returns {JSX.Element} - The JSX for the featured job.
 */
export default function OrganizationCard({ organization }) {
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
          <p className="text-sm font-normal text-slate-500">
            100-1000 employees
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium">
          Creating an open financial system for the world
        </p>
      </CardContent>
      <CardContent className="p-0 border-t border-slate-300">
        <Link
          className="px-5 py-3 block hover:bg-slate-100 rounded-b-md"
          href={`/organizations/${organization.slug}`}
        >
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">
              {organization._count.jobs} open positions
            </p>

            <ChevronRight className="ml-2 h-4 w-4" />
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
