import client from "../database/client";

/**
 * Create a user from the database asynchronously.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to the created user
 */
export async function GetFeaturedOrganizations() {
  return await client.organization.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          jobs: { where: { status: "OPEN" } },
        },
      },
    },
  });
}

export async function CreateNewOrganizationWithUseAndJob(data) {
  try {
    const organization = await client.organization.create({
      data: {
        name: data.organization_name,
        users: {
          create: [
            {
              assignedAt: new Date(),
              user: {
                create: {
                  firstName: data.user_first_name,
                  lastName: data.user_last_name,
                  email: data.user_email,
                },
              },
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    const job = await client.job.create({
      data: {
        title: data.job_title,
        jobType: data.job_employment_type,
        location: data.job_location,
        compType: data.job_compenstation_type,
        payScaleBegin: data.job_salary_low,
        payScaleEnd: data.job_salary_high,
        description: data.job_description,
        jobLocType: data.job_location_requirement,
        status: "DRAFT",
        organization: {
          connect: { id: organization.id },
        },
        user: {
          connect: { id: organization.users[0].userId },
        },
      },
    });

    return { organization, job };
  } catch (error) {
    console.error("Error creating Organization, Users, and Jobs:", error);
  }
}
