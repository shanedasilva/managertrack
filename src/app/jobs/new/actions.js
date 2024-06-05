"use server";

import { CreateNewOrganizationWithUseAndJob } from "@/lib/models/Organization";

export const SaveRecords = async (values) => {
  "use server";

  const createdOrganization = await CreateNewOrganizationWithUseAndJob(values);

  // jobs: {
  //   create: {
  //     title: data.job_title,
  //     jobType: data.job_employment_type,
  //     location: data.job_location,
  //     compType: data.job_compenstation_type,
  //     payScaleBegin: 100000,
  //     payScaleEnd: 200000,
  //     description: data.job_description,
  //     jobLocType: data.job_location_requirement,
  //     status: "DRAFT",
  //   },

  return createdOrganization;
};
