import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

import client from "@/lib/database/client";
import { convertToSlug } from "@/lib/utils/string";

const SEARCH_TERMS = [
  "CEO",
  "Chief Executive Officer",
  "President",
  "COO",
  "Chief Operating Officer",
  "CFO",
  "Chief Financial Officer",
  "CTO",
  "Chief Technology Officer",
  "CIO",
  "Chief Information Officer",
  "Chief Marketing Officer",
  "CMO",
  "Chief Human Resources Officer",
  "CHRO",
  "Chief Sales Officer",
  "Chief Revenue Officer",
  "General Manager",
  "Managing Director",
  "Executive Director",
  "VP",
  "Vice President",
  "Senior Vice President",
  "SVP",
  "Director",
  "Senior Director",
  "Board Member",
  "Board of Directors",
  "Partner",
  "Principal",
  "Head of Strategy",
  "Strategy Director",
  "Chief Strategy Officer",
  "CSO",
  "Head of Operations",
  "Operations Director",
  "Head of Marketing",
  "Marketing Director",
  "Head of Sales",
  "Sales Director",
  "Head of HR",
  "HR Director",
  "Head of Finance",
  "Finance Director",
  "Head of IT",
  "IT Director",
  "Head of Product",
  "Product Director",
  "Head of Engineering",
  "Engineering Director",
  "Head of Development",
  "Development Director",
  "Head of Innovation",
  "Innovation Director",
  "Head of R&D",
  "R&D Director",
  "Chief Innovation Officer",
  "Chief Compliance Officer",
  "Chief Legal Officer",
  "General Counsel",
  "Chief Risk Officer",
  "Chief Security Officer",
  "Chief Digital Officer",
  "CDO",
  "Chief Customer Officer",
  "Chief Experience Officer",
  "Chief Transformation Officer",
  "Chief Sustainability Officer",
  "Chief Diversity Officer",
  "Executive VP",
  "EVP",
  "Deputy Director",
  "Division Manager",
  "Department Head",
  "Team Lead",
  "Program Manager",
  "Program Director",
  "Project Manager",
  "Project Director",
  "Operations Manager",
  "Marketing Manager",
  "Sales Manager",
  "HR Manager",
  "Finance Manager",
  "IT Manager",
  "Product Manager",
  "Engineering Manager",
  "Development Manager",
  "Innovation Manager",
  "R&D Manager",
  "Compliance Manager",
  "Legal Manager",
  "Risk Manager",
  "Security Manager",
  "Digital Manager",
  "Customer Manager",
  "Experience Manager",
  "Transformation Manager",
  "Sustainability Manager",
  "Diversity Manager",
  "Lead Developer",
  "Technical Lead",
  "Development Lead",
  "Engineering Lead",
  "SRE",
  "Product Owner",
  "Scrum Master",
  "Agile Coach",
  "Technical Product Manager",
  "Technical Program Manager",
  "Software Project Manager",
  "Release Manager",
  "Software Development Manager",
  "Software Development Director",
  "Software Engineering Manager",
  "Software Engineering Director",
];

const convertToUrlSearchString = (titles) => {
  return titles.map((title) => title.split(" ").join("+")).join("|OR|");
};

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
    console.log(`Saving organization: ${companyData.externalId}`);

    const organization = await client.organization.upsert({
      create: {
        externalId: companyData.id,
        name: companyData.name,
        logoURL: companyData.logo,
        slug: convertToSlug(companyData.name, true),
        websiteURL: companyData.website_url,
        linkedinURL: companyData.linkedin_url,
        twitterURL: companyData.twitter_handle,
        typeId: organizationTypeId,
      },
      update: {},
      where: {
        externalId: companyData.id,
      },
    });

    organizationId = organization.id;
    organizationCache.set(companyData.id, organizationId);
  }

  return organizationId;
}

/**
 * Processes job results and fetches related company data.
 *
 * @param {Array} results - The job results from the API.
 * @param {Object} headers - The headers for the API request.
 * @param {Object} organizationTypeCache - The cache for organization types.
 * @param {Object} organizationCache - The cache for organizations.
 */
async function processJobResults(
  results,
  headers,
  organizationTypeCache,
  organizationCache
) {
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
}

/**
 * Recursively fetches and processes job data from the API.
 *
 * @param {string} url - The API URL to fetch data from.
 * @param {Object} headers - The headers for the API request.
 * @param {Object} organizationTypeCache - The cache for organization types.
 * @param {Object} organizationCache - The cache for organizations.
 * @param {Object} client - The database client.
 */
async function fetchAndProcessJobs(
  url,
  headers,
  organizationTypeCache,
  organizationCache
) {
  const { next, results } = await fetchData(url, headers);

  console.log("---");
  console.log("---");
  console.log("results", results);
  console.log("---");
  console.log("---");

  await processJobResults(
    results,
    headers,
    organizationTypeCache,
    organizationCache
  );

  if (next !== null) {
    await fetchAndProcessJobs(
      next,
      headers,
      organizationTypeCache,
      organizationCache
    );
  }
}

/**
 * The handler function for the API route.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export async function GET({ headers }, res) {
  if (headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  const url = `https://jobdataapi.com/api/jobs/?experience_level=EX&exclude_expired=true&language=en&max_age=2&page_size=50&region_id=5&title=${convertToUrlSearchString(
    SEARCH_TERMS
  )}`;
  const requestHeaders = {
    Authorization: `Api-Key ${process.env.JOB_DATA_API_KEY}`,
  };

  try {
    console.log("Fetching and saving organizations...");

    // Cache existing organization types and organizations
    const organizationTypeCache = await cacheExistingRecords(
      client.organizationType.findMany,
      "externalId",
      "id"
    );

    // Cache existing organization types and organizations
    const organizationCache = await cacheExistingRecords(
      client.organization.findMany,
      "externalId",
      "id"
    );

    // Fetch and process job data
    await fetchAndProcessJobs(
      url,
      requestHeaders,
      organizationTypeCache,
      organizationCache
    );

    console.log("Fetched and saved organizations successfully");

    return new NextResponse("Organizations fetched and saved successfully", {
      status: StatusCodes.OK,
    });
  } catch (error) {
    console.error("Error fetching organizations:", error.message);

    return new NextResponse("Error fetching organizations", {
      error: error,
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
