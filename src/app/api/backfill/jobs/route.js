import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

import client from "@/lib/database/client";
import { convertToSlug } from "@/lib/utils/string";
import { STATUS_OPEN } from "@/lib/models/Job";

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
 * Ensures the job type is cached and returns its ID.
 *
 * @param {Object} jobTypeCache - The cache for job types.
 * @param {Object} jobTypeInfo - The job type information object containing the external ID.
 * @param {Object} client - The database client.
 * @returns {Promise<number>} - The job type ID.
 */
async function ensureJobTypeCached(jobTypeCache, jobTypeInfo, client) {
  let jobTypeId = jobTypeCache.get(jobTypeInfo.id);

  if (!jobTypeId) {
    const jobType = await client.jobType.findUnique({
      where: { externalId: parseInt(jobTypeInfo.id) },
    });

    if (jobType) {
      jobTypeId = jobType.id;
      jobTypeCache.set(jobTypeInfo.id, jobTypeId);
    }
  }

  return jobTypeId;
}

/**
 * Ensures the job city is cached and returns its ID.
 *
 * @param {Object} jobCityCache - The cache for job cities.
 * @param {Object} cityInfo - The city information object containing the external ID.
 * @param {Object} client - The database client.
 * @returns {Promise<number>} - The job city ID.
 */
async function ensureJobCityCached(jobCityCache, cityInfo, client) {
  let jobCityId = jobCityCache.get(cityInfo.geonameid);

  if (!jobCityId) {
    const jobCity = await client.jobCity.findUnique({
      where: { externalId: parseInt(cityInfo.geonameid) },
    });

    if (jobCity) {
      jobCityId = jobCity.id;
      jobCityCache.set(cityInfo.geonameid, jobCityId);
    }
  }

  return jobCityId;
}

/**
 * Ensures the company data is cached and returns it.
 *
 * @param {Object} companyCache - The cache for company data.
 * @param {number} companyId - The company ID.
 * @param {Object} headers - The headers for the API request.
 * @returns {Promise<Object>} - The company data.
 */
async function ensureCompanyCached(companyCache, companyId, headers) {
  let companyData = companyCache.get(companyId);

  if (!companyData) {
    const companyURL = `https://jobdataapi.com/api/companies/${companyId}`;
    companyData = await fetchData(companyURL, headers);
    companyCache.set(companyId, companyData);
  }

  return companyData;
}

/**
 * Processes job results and fetches related company data.
 *
 * @param {Array} results - The job results from the API.
 * @param {Object} headers - The headers for the API request.
 * @param {Object} jobTypeCache - The cache for job types.
 * @param {Object} jobCityCache - The cache for job cities.
 * @param {Object} companyCache - The cache for company data.
 * @param {Object} client - The database client.
 */
async function processJobResults(
  results,
  headers,
  jobTypeCache,
  jobCityCache,
  companyCache,
  organization
) {
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

    // Fetch company details
    const companyData = await ensureCompanyCached(
      companyCache,
      item.company.id,
      headers
    );

    // Fetch job type
    const jobTypeId = await ensureJobTypeCached(
      jobTypeCache,
      item.types[0],
      client
    );

    jobData.typeId = jobTypeId;

    // Fetch job city if available
    if (item.cities.length) {
      const jobCityId = await ensureJobCityCached(
        jobCityCache,
        item.cities[0],
        client
      );

      jobData.cityId = jobCityId;
    }

    // Fetch industry ID if available
    if (companyData.info_industry) {
      const jobIndustry = await client.jobIndustry.findUnique({
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

    console.log(`Saving jobs for organization: ${jobData.externalId}`);

    // Save job in the database
    await client.job.upsert({
      create: jobData,
      update: {},
      where: {
        externalId: item.id,
      },
    });
  }
}

/**
 * Recursively fetches and processes job data from the API.
 *
 * @param {string} url - The API URL to fetch data from.
 * @param {Object} headers - The headers for the API request.
 * @param {Object} jobTypeCache - The cache for job types.
 * @param {Object} jobCityCache - The cache for job cities.
 * @param {Object} companyCache - The cache for company data.
 */
async function fetchAndProcessJobs(
  url,
  headers,
  jobTypeCache,
  jobCityCache,
  companyCache,
  organization
) {
  const { next, results } = await fetchData(url, headers);
  await processJobResults(
    results,
    headers,
    jobTypeCache,
    jobCityCache,
    companyCache,
    organization
  );

  if (next !== null) {
    await fetchAndProcessJobs(
      next,
      headers,
      jobTypeCache,
      jobCityCache,
      companyCache,
      organization
    );
  }
}

/**
 * Handles the API request and response for fetching and saving jobs.
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

  const requestHeaders = {
    Authorization: `Api-Key ${process.env.JOB_DATA_API_KEY}`,
  };

  try {
    console.log("Fetching and saving jobs...");

    // Fetch all organizations from the database
    const organizations = await client.organization.findMany();

    // Cache existing job types, job cities, and companies
    const jobTypeCache = await cacheExistingRecords(
      client.jobType.findMany,
      "externalId",
      "id"
    );

    const jobCityCache = await cacheExistingRecords(
      client.jobCity.findMany,
      "externalId",
      "id"
    );

    const companyCache = new Map();

    // Process each organization
    for (const organization of organizations) {
      const url = `https://jobdataapi.com/api/jobs/?company_id=${
        organization.externalId
      }&experience_level=EX&exclude_expired=true&language=en&max_age=30&page_size=50&region_id=5&title=${convertToUrlSearchString(
        SEARCH_TERMS
      )}`;

      // Fetch and process job data
      await fetchAndProcessJobs(
        url,
        requestHeaders,
        jobTypeCache,
        jobCityCache,
        companyCache,
        organization
      );
    }

    console.log("Fetched and saved jobs successfully");

    return new NextResponse("Jobs fetched and saved successfully", {
      status: StatusCodes.OK,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error.message);

    return new NextResponse("Error fetching jobs", {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
