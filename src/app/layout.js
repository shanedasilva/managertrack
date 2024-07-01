import { Inter as FontSans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  image: "/managertrack.jpg", // Fixed key name to 'image'
};

/**
 * RootLayout component for providing a common layout structure.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The children components to be rendered within the layout.
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
        </body>

        <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
      </html>
    </ClerkProvider>
  );
}
