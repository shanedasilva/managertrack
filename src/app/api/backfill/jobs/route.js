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
 * @returns {Promise<Map>} - A Map with cached records.
 */
async function cacheExistingRecords(findManyFunc, keyField) {
  const cache = new Map();
  const records = await findManyFunc();

  records.forEach((record) => {
    cache.set(record[keyField], record);
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
  let jobType = jobTypeCache.get(jobTypeInfo.id);

  if (!jobType) {
    jobType = await client.jobType.findUnique({
      where: { externalId: parseInt(jobType.id) },
    });

    if (jobType) {
      jobTypeCache.set(jobTypeInfo.id, jobType);
    }
  }

  return jobType;
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
  let jobCity = jobCityCache.get(cityInfo.geonameid);

  if (!jobCity) {
    jobCity = await client.jobCity.findUnique({
      where: { externalId: parseInt(cityInfo.geonameid) },
    });

    if (jobCity) {
      jobCityCache.set(cityInfo.geonameid, jobCity);
    }
  }

  return jobCity;
}

/**
 * Ensures the company data is cached and returns it.
 *
 * @param {Object} companyCache - The cache for company data.
 * @param {Object} JobTypeCache - The cache for company types.
 * @param {number} externalCompanyId - The company ID.
 * @param {Object} headers - The headers for the API request.
 * @returns {Promise<Object>} - The company data.
 */
async function ensureCompanyCached(
  companyCache,
  externalCompanyId,
  organizationTypeCache,
  headers
) {
  let companyData = companyCache.get(externalCompanyId);
  let savedCompany;

  if (!companyData) {
    const companyURL = `https://jobdataapi.com/api/companies/${externalCompanyId}`;
    companyData = await fetchData(companyURL, headers);

    if (!companyData) {
      throw new Error(`Company with ID ${externalCompanyId} not found`);
    }

    if (Array.isArray(companyData.info_type)) {
      const organizationType = organizationTypeCache.get(
        companyData.info_type[0].id
      );

      try {
        savedCompany = await client.organization.create({
          data: {
            externalId: externalCompanyId,
            name: companyData.name,
            slug: convertToSlug(companyData.name, true),
            description: companyData.info_description,
            logoURL: companyData.logo,
            websiteURL: companyData.website_url,
            linkedinURL: companyData.linkedin_url,
            twitterURL: companyData.twitter_handle,
            typeId: organizationType.id,
          },
        });
      } catch (error) {
        console.error("Code: ", error);
      }

      delete savedCompany.description;

      companyCache.set(externalCompanyId, {
        id: savedCompany.id,
        industryId: companyData.info_industry.id,
      });

      console.log("sdfsdfsfsf");

      companyData = {
        id: savedCompany.id,
        industryId: companyData.info_industry.id,
      };
    }
  }

  return companyData;
}

/**
 * Processes job results and fetches related organization data.
 *
 * @param {Array} results - The job results from the API.
 * @param {Object} headers - The headers for the API request.
 * @param {Object} jobTypeCache - The cache for job types.
 * @param {Object} jobCityCache - The cache for job cities.
 * @param {Object} jobIndustryCache - The cache for job industries.
 * @param {Object} organizationCache - The cache for organization data.
 */
async function processJobResults(
  results,
  headers,
  jobTypeCache,
  jobCityCache,
  jobIndustryCache,
  companyCache,
  organizationTypeCache
) {
  const formattedJobs = [];

  for (const item of results) {
    // Fetch company details
    const companyData = await ensureCompanyCached(
      companyCache,
      item.company.id,
      organizationTypeCache,
      headers
    );

    if (companyData.industryId) {
      // Fetch job type
      const jobType = await ensureJobTypeCached(
        jobTypeCache,
        item.types[0],
        client
      );

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
        organizationId: companyData.id,
      };

      jobData.typeId = jobType.id;

      // Fetch job city if available
      if (item.cities.length) {
        const jobCity = await ensureJobCityCached(
          jobCityCache,
          item.cities[0],
          client
        );

        jobData.cityId = jobCity.id;
      }

      const jobIndustry = jobIndustryCache.get(companyData.industryId);

      if (jobIndustry) {
        jobData.industryId = jobIndustry.id;
      }

      // Calculate activeUntil (30 days from item.published)
      jobData.activeUntil = new Date(
        new Date(item.published).getTime() + 30 * 24 * 60 * 60 * 1000
      );

      formattedJobs.push(jobData);
    }
  }

  if (formattedJobs.length > 0) {
    await client.job.createMany({
      data: formattedJobs,
      skipDuplicates: true,
    });

    console.log(`Saved ${results.length} jobs`);
  }
}

/**
 * Recursively fetches and processes job data from the API.
 *
 * @param {string} url - The API URL to fetch data from.
 * @param {Object} headers - The headers for the API request.
 * @param {Object} jobTypeCache - The cache for job types.
 * @param {Object} jobCityCache - The cache for job cities.
 * @param {Object} jobIndustryCache - The cache for job industries.
 * @param {Object} organizationCache - The cache for organizatino data.
 */
async function fetchAndProcessJobs(
  url,
  headers,
  jobTypeCache,
  jobCityCache,
  jobIndustryCache,
  organizationCache,
  organizationTypeCache
) {
  const { next, results } = await fetchData(url, headers);

  await processJobResults(
    results,
    headers,
    jobTypeCache,
    jobCityCache,
    jobIndustryCache,
    organizationCache,
    organizationTypeCache
  );

  if (next !== null) {
    await fetchAndProcessJobs(
      next,
      headers,
      jobTypeCache,
      jobCityCache,
      jobIndustryCache,
      organizationCache,
      organizationTypeCache
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
    cache: "no-store",
  };

  try {
    console.log("Fetching and saving jobs...");

    // Cache existing job types
    const jobTypeCache = await cacheExistingRecords(
      client.jobType.findMany,
      "externalId"
    );

    // Cache existing job cities
    const jobCityCache = await cacheExistingRecords(
      client.jobCity.findMany,
      "externalId"
    );

    // Cache existing job industries
    const jobIndustryCache = await cacheExistingRecords(
      client.jobIndustry.findMany,
      "externalId"
    );

    // Cache existing organizations
    const organizationCache = await cacheExistingRecords(
      client.organization.findMany,
      "externalId"
    );

    // Cache existing organization types
    const organizationTypeCache = await cacheExistingRecords(
      client.organizationType.findMany,
      "externalId"
    );

    // Process each pagination set of job results
    const url = `https://jobdataapi.com/api/jobs/?experience_level=EX&exclude_expired=true&language=en&max_age=30&page_size=200&region_id=5&title=${convertToUrlSearchString(
      SEARCH_TERMS
    )}`;

    // Fetch and process job data
    await fetchAndProcessJobs(
      url,
      requestHeaders,
      jobTypeCache,
      jobCityCache,
      jobIndustryCache,
      organizationCache,
      organizationTypeCache
    );

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
