import client from "@/lib/database/client";
import { convertToSlug } from "@/lib/utils/string";

/**
 * Fetches job regions from the external API and stores them in the database.
 *
 * @async
 * @throws {Error} Will throw an error if the API request fails or if there is an issue with database operations.
 */
export async function fetchJobRegions() {
  const url = `https://jobdataapi.com/api/jobregions/`;
  const headers = {
    Authorization: `Api-Key ${process.env.JOB_DATA_API_KEY}`,
  };

  try {
    console.log("Fetching and saving job regions...");

    // Make the GET request to the API
    const response = await fetch(url, { headers });

    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Prepare data for job region creation
    const createData = data.map((item) => ({
      externalId: item.id,
      name: item.name,
      slug: convertToSlug(item.name),
    }));

    // Store job regions in the database
    await client.jobRegion.createMany({
      data: createData,
      skipDuplicates: true,
    });

    console.log("Fetched and saved job regions successfully.");
  } catch (error) {
    console.error("Error fetching job regions:", error.message);
    throw error; // Rethrow the error to propagate it upwards
  }
}

/**
 * Fetches job countries from the external API, processes the data, and saves it to the database.
 *
 * @async
 * @throws {Error} Will throw an error if the API request fails or if there is an issue with database operations.
 */
export async function fetchJobCountries() {
  const url = `https://jobdataapi.com/api/jobcountries/`;
  const headers = {
    Authorization: `Api-Key ${process.env.JOB_DATA_API_KEY}`,
  };

  try {
    console.log("Fetching and saving job countries...");

    // Make the GET request to the API
    const response = await fetch(url, { headers });

    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Prepare data for job country creation
    const createData = data.map((item) => ({
      code: item.code,
      name: item.name,
      regionExternalId: item.region.id,
    }));

    // Group job countries by regionExternalId
    const groupedByRegionExternalId = createData.reduce((acc, item) => {
      const regionId = item.regionExternalId;
      if (!acc[regionId]) {
        acc[regionId] = [];
      }

      acc[regionId].push({
        code: item.code,
        name: item.name,
        externalId: item.id,
      });

      return acc;
    }, {});

    let stuff = [];

    // Save job countries to the database
    for (const regionId in groupedByRegionExternalId) {
      if (groupedByRegionExternalId.hasOwnProperty(regionId)) {
        const jobRegion = await client.jobRegion.findUnique({
          where: { externalId: parseInt(regionId) },
        });

        const saveData = groupedByRegionExternalId[regionId].map((item) => ({
          code: item.code,
          name: item.name,
          externalId: item.externalId,
          regionId: jobRegion.id,
          slug: convertToSlug(item.name),
        }));

        stuff = [...stuff, ...saveData];
      }
    }

    await client.jobCountry.createMany({
      data: stuff,
      skipDuplicates: true,
    });

    console.log("Fetched and saved job countries successfully");
  } catch (error) {
    console.error("Error fetching job countries:", error.message);
    throw error; // Rethrow the error to propagate it upwards
  }
}

/**
 * Fetches job cities from the external API, processes the data, and saves it to the database.
 *
 * @async
 * @throws {Error} Will throw an error if the API request fails or if there is an issue with database operations.
 */
export async function fetchJobCities() {
  try {
    console.log("Fetching and saving job cities...");

    const countries = await client.jobCountry.findMany({
      select: {
        id: true,
        code: true,
        name: true,
      },
    });

    const headers = {
      Authorization: `Api-Key ${process.env.JOB_DATA_API_KEY}`,
    };

    for (const country of countries) {
      const url = `https://jobdataapi.com/api/jobcities/?country_code=${country.code}&page_size=5000`;

      // Make the GET request to the API
      const response = await fetch(url, { headers });

      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the JSON response
      const data = await response.json();

      // Prepare data for job city creation
      const createData = data.results.map((item) => ({
        externalId: item.geonameid,
        name: item.name,
        timezone: item.timezone,
        latitude: item.latitude,
        longitude: item.longitude,
        countryId: country.id,
        slug: convertToSlug(item.name, true),
      }));

      await client.jobCity.createMany({
        data: createData,
        skipDuplicates: true,
      });
    }

    console.log("Fetched and saved job countries successfully");
  } catch (error) {
    console.error("Error fetching or creating job cities:", error.message);
    throw error; // Propagate the error to the caller
  }
}

/**
 * Fetches job industries from the external API and stores them in the database.
 *
 * @async
 * @throws {Error} Will throw an error if the API request fails or if there is an issue with database operations.
 */
export async function fetchJobIndustries() {
  const url = `https://jobdataapi.com/api/industries/`;
  const headers = {
    Authorization: `Api-Key ${process.env.JOB_DATA_API_KEY}`,
  };

  try {
    console.log("Fetching and saving job industries...");

    // Make the GET request to the API
    const response = await fetch(url, { headers });

    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Prepare data for job region creation
    const createData = data.map((item) => ({
      externalId: item.id,
      name: item.name,
      slug: convertToSlug(item.name),
    }));

    // Store job regions in the database
    await client.jobIndustry.createMany({
      data: createData,
      skipDuplicates: true,
    });

    console.log("Fetched and saved job industries successfully");
  } catch (error) {
    console.error("Error fetching job industries:", error.message);
    throw error; // Rethrow the error to propagate it upwards
  }
}

/**
 * Fetches job types from the external API and stores them in the database.
 *
 * @async
 * @throws {Error} Will throw an error if the API request fails or if there is an issue with database operations.
 */
export async function fetchJobTypes() {
  const url = `https://jobdataapi.com/api/jobtypes/`;
  const headers = {
    Authorization: `Api-Key ${process.env.JOB_DATA_API_KEY}`,
  };

  try {
    console.log("Fetching and saving job types...");

    // Make the GET request to the API
    const response = await fetch(url, { headers });

    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Prepare data for job region creation
    const createData = data.map((item) => ({
      externalId: item.id,
      name: item.name,
      slug: convertToSlug(item.name),
    }));

    // Store job regions in the database
    await client.jobType.createMany({
      data: createData,
      skipDuplicates: true,
    });

    console.log("Fetching and saved job types successfully");
  } catch (error) {
    console.error("Error fetching job types:", error.message);
    throw error; // Rethrow the error to propagate it upwards
  }
}

/**
 * Fetches organization types from the external API and stores them in the database.
 *
 * @async
 * @throws {Error} Will throw an error if the API request fails or if there is an issue with database operations.
 */
export async function fetchOrganizationTypes() {
  const url = `https://jobdataapi.com/api/companytypes/`;
  const headers = {
    Authorization: `Api-Key ${process.env.JOB_DATA_API_KEY}`,
  };

  try {
    console.log("Fetching and saving organization types...");

    // Make the GET request to the API
    const response = await fetch(url, { headers });

    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Prepare data for job region creation
    const createData = data.map((item) => ({
      externalId: item.id,
      name: item.name,
      slug: convertToSlug(item.name),
    }));

    // Store job regions in the database
    await client.organizationType.createMany({
      data: createData,
      skipDuplicates: true,
    });

    console.log("Fetched and saved organizaiton types successfully");
  } catch (error) {
    console.error("Error fetching organization types:", error.message);
    throw error; // Rethrow the error to propagate it upwards
  }
}
