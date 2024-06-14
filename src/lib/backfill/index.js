import client from "@/lib/database/client";

import { convertToSlug } from "@/lib/utils/string";
import { STATUS_OPEN } from "@/lib/models/Job";

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

/**
 * Fetches organizations from the external API and stores them in the database.
 *
 * @async
 * @function fetchOrganizations
 * @throws {Error} Will throw an error if the API request fails or if there is an issue with database operations.
 */
export async function fetchOrganizations() {
  const url = `https://jobdataapi.com/api/jobs/?experience_level=EX&max_age=30`;
  const headers = {
    Authorization: `Api-Key ${process.env.JOB_DATA_API_KEY}`,
  };

  try {
    console.log("Fetching and saving organizations...");

    // Make the GET request to the API
    const response = await fetch(url, { headers });

    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const { results } = await response.json();

    // Local caches for organizations and organization types
    const organizationCache = new Map();
    const organizationTypeCache = new Map();

    // Fetch all existing organization types from the database and cache them
    const existingOrganizationTypes = await client.organizationType.findMany();
    existingOrganizationTypes.forEach((type) => {
      organizationTypeCache.set(type.externalId, type.id);
    });

    // Fetch all existing organizations from the database and cache them
    const existingOrganizations = await client.organization.findMany();
    existingOrganizations.forEach((org) => {
      organizationCache.set(org.externalId, org.id);
    });

    for (const item of results) {
      // Fetch company details
      const companyURL = `https://jobdataapi.com/api/companies/${item.company.id}`;
      const companyResponse = await fetch(companyURL, { headers });

      // Check if the company response is ok (status code 200-299)
      if (!companyResponse.ok) {
        throw new Error(`HTTP error! status: ${companyResponse.status}`);
      }

      // Parse the JSON response for company details
      const companyData = await companyResponse.json();

      if (
        companyData.info_type !== null &&
        companyData.info_industry !== null &&
        item.cities.length
      ) {
        // Check if organization type exists in cache
        let organizationTypeId = organizationTypeCache.get(
          companyData.info_type.id
        );

        if (!organizationTypeId) {
          const organizationType = await client.organizationType.findUnique({
            where: { externalId: companyData.info_type.id },
          });

          if (organizationType) {
            organizationTypeId = organizationType.id;
            organizationTypeCache.set(
              companyData.info_type.id,
              organizationTypeId
            );
          }
        }

        // Check if organization exists in cache
        let organizationId = organizationCache.get(companyData.id);

        if (!organizationId) {
          const organization = await client.organization.create({
            data: {
              externalId: companyData.id,
              name: companyData.name,
              logoURL: companyData.logo,
              slug: convertToSlug(companyData.name, true),
              websiteURL: companyData.website_url,
              linkedinURL: companyData.linkedin_url,
              twitterURL: companyData.twitter_handle,
              typeId: organizationTypeId,
            },
          });

          organizationId = organization.id;
          organizationCache.set(companyData.id, organizationId);
        }
      }
    }

    console.log("Fetched and saved organizations successfully");
  } catch (error) {
    console.error("Error fetching organizations:", error.message);
    throw error; // Rethrow the error to propagate it upwards
  }
}

/**
 * Fetches jobs from the external API for each organization and stores them in the database.
 *
 * @async
 * @function fetchAndSaveJobs
 * @throws {Error} Will throw an error if the API request fails or if there is an issue with database operations.
 */
export async function fetchJobs() {
  const headers = {
    Authorization: `Api-Key ${process.env.JOB_DATA_API_KEY}`,
  };

  try {
    console.log("Fetching and saving jobs...");

    // Fetch all organizations from the database
    const organizations = await client.organization.findMany();

    // Local caches for job types, job cities, and company details
    const jobTypeCache = new Map();
    const jobCityCache = new Map();
    const companyCache = new Map();

    // Fetch all existing job types from the database and cache them
    const existingJobTypes = await client.jobType.findMany();
    existingJobTypes.forEach((type) => {
      jobTypeCache.set(type.externalId, type.id);
    });

    // Fetch all existing job cities from the database and cache them
    const existingJobCities = await client.jobCity.findMany();
    existingJobCities.forEach((city) => {
      jobCityCache.set(city.externalId, city.id);
    });

    for (const organization of organizations) {
      const url = `https://jobdataapi.com/api/jobs/?company_id=${organization.externalId}&experience_level=EX&max_age=30`;

      // Make the GET request to the API
      const response = await fetch(url, { headers });

      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the JSON response
      const { results } = await response.json();

      for (const item of results) {
        // Prepare data for job creation
        const jobData = {
          title: item.title,
          externalId: item.id,
          slug: convertToSlug(item.title, true),
          applyURL: item.application_url,
          compType: "SALARY",
          payScaleBegin: parseInt(item.salary_min),
          payScaleEnd: parseInt(item.salary_max),
          payCurrency: item.salary_currency,
          description: item.description,
          jobLocType: item.has_remote ? "REMOTE" : "HYBRID",
          status: STATUS_OPEN,
          organizationId: organization.id,
        };

        // Fetch company details from cache or API
        let companyData = companyCache.get(item.company.id);
        if (!companyData) {
          const companyURL = `https://jobdataapi.com/api/companies/${item.company.id}`;
          const companyResponse = await fetch(companyURL, { headers });

          // Check if the company response is ok (status code 200-299)
          if (!companyResponse.ok) {
            throw new Error(`HTTP error! status: ${companyResponse.status}`);
          }

          // Parse the JSON response for company details
          companyData = await companyResponse.json();
          companyCache.set(item.company.id, companyData);
        }

        // Fetch job type
        let jobTypeId = jobTypeCache.get(item.types[0].id);

        if (!jobTypeId) {
          const jobType = await client.jobType.findUnique({
            where: { externalId: parseInt(item.types[0].id) },
          });

          if (jobType) {
            jobTypeId = jobType.id;
            jobTypeCache.set(item.types[0].id, jobTypeId);
          }
        }

        jobData.typeId = jobTypeId;

        if (item.cities.length) {
          // Fetch job city
          let jobCityId = jobCityCache.get(item.cities[0].geonameid);

          if (!jobCityId) {
            const jobCity = await client.jobCity.findUnique({
              where: { externalId: parseInt(item.cities[0].geonameid) },
            });

            if (jobCity) {
              jobCityId = jobCity.id;
              jobCityCache.set(item.cities[0].id, jobCityId);
            }
          }

          jobData.cityId = jobCityId;
        }

        // Fetch industryId
        let jobIndustry = null;
        if (companyData.info_industry) {
          jobIndustry = await client.jobIndustry.findUnique({
            where: { externalId: parseInt(companyData.info_industry.id) },
          });

          if (jobIndustry) {
            jobData.industryId = jobIndustry.id;
          }
        }

        // Calculate activeUntil (30 days from item.published)
        jobData.activeUntil = new Date(
          new Date(item.published).getTime() + 30 * 24 * 60 * 60 * 1000
        );

        // Save job in the database
        await client.job.create({
          data: jobData,
        });
      }
    }

    console.log("Fetched and saved jobs successfully");
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
    throw error; // Rethrow the error to propagate it upwards
  }
}
