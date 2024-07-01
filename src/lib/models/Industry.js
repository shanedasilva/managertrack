import client from "@/lib/database/client";

export async function getPopularIndustries() {
  try {
    const queryParams = {
      take: 10,
      orderBy: {
        jobs: {
          _count: "desc",
        },
      },
    };

    return await client.jobIndustry.findMany(queryParams);
  } catch (error) {
    console.error(
      "Error fetching popular industries:",
      error.message,
      error.stack
    );

    throw error;
  }
}
