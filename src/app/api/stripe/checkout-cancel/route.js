"use server";

import { NextResponse } from "next/server";

/**
 * Handles GET requests to update a job's payment status and redirect the user.
 *
 * @returns {Promise<NextResponse>} The response to be sent back.
 */
export async function GET() {
  let redirectUrl = process.env.NEXT_PUBLIC_BASE_APP_URL;

  // Redirect the user to the appropriate URL
  return NextResponse.redirect(new URL(redirectUrl));
}
