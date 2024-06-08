"use server";

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * Handles GET requests to update a job's payment status and redirect the user.
 *
 * @returns {Promise<NextResponse>} The response to be sent back.
 */
export async function GET() {
  // Authenticate the user
  const { userId } = auth();
  let redirectUrl = process.env.NEXT_PUBLIC_BASE_APP_URL;

  // Redirect unauthenticated users to the sign-in page
  if (!userId) {
    redirectUrl = `${process.env.NEXT_PUBLIC_BASE_APP_URL}/sign-in`;
  }

  // Redirect the user to the appropriate URL
  return NextResponse.redirect(new URL(redirectUrl));
}
