"use client";

import Link from "next/link";
import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { ChevronRight, Menu, X } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserNavigation from "@/components/UserNavigation";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Jobs", href: "#" },
  { name: "Organizations", href: "#" },
  { name: "Advertise", href: "#" },
  { name: "More", href: "#" },
];

const avatartUrl =
  "https://media.licdn.com/dms/image/D560BAQE-TVg0lqA0AQ/company-logo_100_100/0/1717354237442/managertrack_logo?e=1725494400&v=beta&t=FFJ9uGUqwJ8IDdvRkJKsffAzej7nBGPZxpd87qKe-pc";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-slate-300 fixed top-0 w-full bg-white z-50">
      <nav
        className="mx-auto flex max-full items-center justify-between py-4 px-4 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link
            href={process.env.NEXT_PUBLIC_BASE_APP_URL}
            className="-m-1.5 p-1.5"
          >
            <span className="sr-only">ManagerTrack</span>
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatartUrl} alt="ManagerTrack" />
              <AvatarFallback>MT</AvatarFallback>
            </Avatar>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              {item.name}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <SignedIn>
            <UserNavigation />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button variant="outline" asChild>
                <Link
                  className="rounded bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 border-slate-900 hover:bg-slate-100 mr-2"
                  href="/login"
                >
                  Sign In
                </Link>
              </Button>
            </SignInButton>
          </SignedOut>

          <Button asChild>
            <Link
              href="/jobs/new"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Post a Job
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </nav>

      <Dialog
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
