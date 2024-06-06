import Link from "next/link";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const avatartUrl =
  "https://media.licdn.com/dms/image/D560BAQE-TVg0lqA0AQ/company-logo_100_100/0/1717354237442/managertrack_logo?e=1725494400&v=beta&t=FFJ9uGUqwJ8IDdvRkJKsffAzej7nBGPZxpd87qKe-pc";

export default function Navigation({ className, ...props }) {
  return (
    <nav
      className={cn(
        "text-base font-medium flex items-center space-x-4 lg:space-x-2",
        className
      )}
      {...props}
    >
      <Link href={process.env.NEXT_PUBLIC_BASE_APP_URL}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatartUrl} alt="ManagerTrack" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
      </Link>

      <p>ManagerTrack</p>
    </nav>
  );
}
