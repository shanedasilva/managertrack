"use server";

import { CreateNewOrganizationWithUserAndPost } from "@/lib/models/Organization";

export const SaveRecords = async (values) => {
  "use server";

  return CreateNewOrganizationWithUserAndPost(values);
};
