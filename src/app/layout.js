import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Managertrack",
  description: "Managertrack is where top talents go to easily access active management job opportunities from vetted tech companies.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <script defer src="https://cloud.umami.is/script.js" data-website-id="78db0d63-9409-47bf-ad77-bd47e1e234a5"></script>
      <Analytics />
    </html>
  );
}
