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
        name: "Example Organization",
        users: {
          create: [
            {
              assignedAt: new Date(),
              user: {
                create: {
                  externalId: "test",
                  firstName: "John",
                  lastName: "Doe",
                  email: "john@example.com",
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
        title: "Software Engineer",
        jobType: "FULL_TIME",
        location: "Remote",
        compType: "SALARY",
        payScaleBegin: 60000,
        payScaleEnd: 80000,
        description: "Join our team as a Software Engineer!",
        jobLocType: "REMOTE",
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
