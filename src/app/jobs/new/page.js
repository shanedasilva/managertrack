import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

import { JobForm } from "@/app/jobs/new/components/job-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserNavigation from "@/components/UserNavigation";
import { Button } from "@/components/ui/button";
import { findUserByClerkUserId } from "@/lib/models/User";

const avatartUrl =
  "https://media.licdn.com/dms/image/D560BAQE-TVg0lqA0AQ/company-logo_100_100/0/1717354237442/managertrack_logo?e=1725494400&v=beta&t=FFJ9uGUqwJ8IDdvRkJKsffAzej7nBGPZxpd87qKe-pc";

export const metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default async function Page() {
  const { userId } = auth();
  let user = await findUserByClerkUserId(userId);

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/authentication-light.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />

        <Image
          src="/examples/authentication-dark.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>

      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-8 lg:px-0">
        <div className="absolute right-4 top-4 md:right-8 md:top-8">
          <SignedIn>
            <UserNavigation />
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </SignInButton>
          </SignedOut>
        </div>

        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r col-span-2">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Link href={process.env.NEXT_PUBLIC_BASE_APP_URL}>
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={avatartUrl} alt="ManagerTrack" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
            </Link>
            ManagerTrack
          </div>

          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>

        <div className="lg:px-48 lg:py-16 col-span-6">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-full">
            <JobForm sessionUser={user} />

            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
