import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
      <html lang="en">
        <body className={inter.className}>
          <main>{children}</main>
        </body>

        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="78db0d63-9409-47bf-ad77-bd47e1e234a5"
        ></script>
      </html>
    </ClerkProvider>
  );
}
