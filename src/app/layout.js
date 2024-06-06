import { Inter as FontSans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";

import "../styles/globals.css";

import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "ManagerTrack",
  description:
    "Managertrack is where top talents go to easily access active management job opportunities from vetted tech companies.",
  on: "/managertrack.jpg",
};

/**
 * RootLayout component for providing a common layout structure.
 *
 * @param {Object} children - The children components to be rendered within the layout.
 * @returns {JSX.Element} JSX for the RootLayout component.
 */
export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <main>{children}</main>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
