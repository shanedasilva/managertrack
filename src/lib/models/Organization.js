import client from "@/lib/database/client";

/**
 * Asynchronously retrieves featured organizations from the database.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to the featured organizations.
 */
export async function getFeaturedOrganizations() {
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
    take: 4,
  });
}

/**
 * Asynchronously creates a new organization with a user and a job.
 *
 * @param {Object} data - Data object containing information about the organization, user, and job.
 * @returns {Promise<Object>} A promise that resolves to an object containing the created organization and job.
 */
export async function createNewOrganizationWithUserAndJob(data) {
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
