import client from "../database/client";

/**
 * Create a user from the database asynchronously.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to the created user
 */
export async function GetFeedJobs() {
  return await client.job.findMany({
    where: {
      status: "OPEN",
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}
