import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

import client from "@/lib/database/client";

/**
 * Fetches data from a given URL with provided headers.
 *
 * @param {string} url - The URL to fetch data from.
 * @param {Object} headers - The headers to include in the fetch request.
 * @returns {Promise<Object>} - The JSON response from the API.
 * @throws Will throw an error if the fetch response is not ok.
 */
async function fetchData(url, headers) {
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Caches existing records from the database in a Map.
 *
 * @param {Function} findManyFunc - The function to fetch records from the database.
 * @param {string} keyField - The field to use as the key in the cache.
 * @param {string} valueField - The field to use as the value in the cache.
 * @returns {Promise<Map>} - A Map with cached records.
 */
async function cacheExistingRecords(findManyFunc, keyField, valueField) {
  const cache = new Map();
  const records = await findManyFunc();

  records.forEach((record) => {
    cache.set(record[keyField], record[valueField]);
  });

  return cache;
}

/**
 * Ensures the organization type is cached and returns its ID.
 *
 * @param {Object} organizationTypeCache - The cache for organization types.
 * @param {Object} infoType - The information type object containing the external ID.
 * @param {Object} client - The database client.
 * @returns {Promise<number>} - The organization type ID.
 */
async function ensureOrganizationTypeCached(
  organizationTypeCache,
  infoType,
  client
) {
  let organizationTypeId = organizationTypeCache.get(infoType.id);

  if (!organizationTypeId) {
    const organizationType = await client.organizationType.findUnique({
      where: { externalId: infoType.id },
    });

    if (organizationType) {
      organizationTypeId = organizationType.id;
      organizationTypeCache.set(infoType.id, organizationTypeId);
    }
  }

  return organizationTypeId;
}

/**
 * Creates an organization if it doesn't exist and caches the result.
 *
 * @param {Object} organizationCache - The cache for organizations.
 * @param {Object} companyData - The company data from the API.
 * @param {number} organizationTypeId - The organization type ID.
 * @param {Object} client - The database client.
 * @returns {Promise<number>} - The organization ID.
 */
async function ensureOrganizationCreatedAndCached(
  organizationCache,
  companyData,
  organizationTypeId,
  client
) {
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

  return organizationId;
}

/**
 * The handler function for the API route.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export async function GET(req, res) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse("Unauthorized", {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  const url = `https://jobdataapi.com/api/jobs/?experience_level=EX&max_age=1`;
  const headers = {
    Authorization: `Api-Key ${process.env.JOB_DATA_API_KEY}`,
  };

  try {
    console.log("Fetching and saving organizations...");

    // Fetch job data
    const { results } = await fetchData(url, headers);

    // Cache existing organization types and organizations
    const organizationTypeCache = await cacheExistingRecords(
      client.organizationType.findMany,
      "externalId",
      "id"
    );

    const organizationCache = await cacheExistingRecords(
      client.organization.findMany,
      "externalId",
      "id"
    );

    // Process each job item
    for (const item of results) {
      const companyURL = `https://jobdataapi.com/api/companies/${item.company.id}`;
      const companyData = await fetchData(companyURL, headers);

      if (
        companyData.info_type !== null &&
        companyData.info_industry !== null &&
        item.cities.length
      ) {
        const organizationTypeId = await ensureOrganizationTypeCached(
          organizationTypeCache,
          companyData.info_type,
          client
        );

        await ensureOrganizationCreatedAndCached(
          organizationCache,
          companyData,
          organizationTypeId,
          client
        );
      }
    }

    console.log("Fetched and saved organizations successfully");

    return new NextResponse("Organizations fetched and saved successfully", {
      status: StatusCodes.OK,
    });
  } catch (error) {
    console.error("Error fetching organizations:", error.message);

    return new NextResponse("Error fetching organizations", {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
