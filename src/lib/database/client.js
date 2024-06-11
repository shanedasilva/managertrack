import { PrismaClient } from "@prisma/client";
import { deleteSearchObjects } from "@/lib/search/client";

// Declare the prisma variable to hold the PrismaClient instance
let prisma = null;

// List of models that support soft deletion
const softDeletable = [
  "User",
  "Resume",
  "ResumeEducation",
  "ResumeExperience",
  "ResumeSkills",
  "Organization",
  "Tag",
  "Job",
  "JobApplication",
];

// List of models that are indexed for search
const searchable = ["User", "Organization", "Job"];

/**
 * Initializes the PrismaClient instance.
 * Uses a global instance in development to avoid multiple instances in hot-reloaded development environment.
 * Creates a new instance in production.
 */
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

/**
 * Main function to set up Prisma middleware.
 */
async function main() {
  /**
   * Middleware to handle soft deletes for the Post model.
   * Intercepts delete and deleteMany actions, and converts them to update actions setting a `deleted` flag.
   *
   * @param {Object} params - The Prisma query parameters.
   * @param {Function} next - The next middleware or query execution function.
   * @returns {Promise<Object>} - The result of the next middleware or query execution.
   */
  prisma.$use(async (params, next) => {
    // Handle the webhook event based on its type
    switch (params.action) {
      case "find":
        params = handleFindAction(params);
        break;
      case "findMany":
        params = handleFindManyAction(params);
        break;
      case "delete":
        params = handleDeleteAction(params);
        break;
      case "deleteMany":
        params = handleDeleteManyAction(params);
        break;
      default:
        break;
    }

    // Execute the next middleware or query
    return next(params);
  });
}

/**
 * Handles the find action for models that support soft deletion.
 * Ensures that only non-deleted records are returned by adding a `deletedAt: null` condition to the query.
 *
 * @param {Object} params - The Prisma query parameters.
 * @returns {Object} - The modified Prisma query parameters.
 */
function handleFindAction(params) {
  try {
    // Check if the model supports soft deletion
    if (softDeletable.includes(params.model)) {
      // Add `deletedAt: null` condition to the where clause
      params.args.where = { ...params.args.where, deletedAt: null };

      console.log(
        `Find action handled for model with soft delete: ${params.model}`
      );
    }

    return params;
  } catch (error) {
    console.error("Error handling find action:", error);
  }
}

/**
 * Handles the findMany action for models that support soft deletion.
 * Ensures that only non-deleted records are returned by adding a `deletedAt: null` condition to the query.
 *
 * @param {Object} params - The Prisma query parameters.
 * @returns {Object} - The modified Prisma query parameters.
 */
function handleFindManyAction(params) {
  try {
    // Check if the model supports soft deletion
    if (softDeletable.includes(params.model)) {
      // Add `deletedAt: null` condition to the where clause
      params.args.where = { ...params.args.where, deletedAt: null };

      console.log(
        `FindMany action handled for model with soft delete: ${params.model}`
      );
    }

    return params;
  } catch (error) {
    console.error("Error handling findMany action:", error);
  }
}

/**
 * Handles the delete action for models that support soft deletion.
 * Changes the action to 'update' and sets the 'deletedAt' flag.
 *
 * @param {Object} params - The Prisma query parameters.
 * @returns {void}
 */
function handleDeleteAction(params) {
  try {
    // Check if the model supports soft deletion
    if (softDeletable.includes(params.model)) {
      // Change action to 'update' and set the 'deletedAt' flag
      params.action = "update";
      params.args.data = { deletedAt: new Date() };

      console.log(`Soft delete action handled for model: ${params.model}`);
    }

    // Check if the model supports search indexing
    if (process.env.SEARCH_ENABLED) {
      if (searchable.includes(params.model)) {
        deleteSearchObjects(params.model, params.args.data);

        console.log(`Search objects deleted for model: ${params.model}`);
      }
    }

    return params;
  } catch (error) {
    console.error("Error handling delete action:", error);
  }
}

/**
 * Handles the deleteMany action for models that support soft deletion.
 * Changes the action to 'updateMany' and sets the 'deletedAt' flag.
 *
 * @param {Object} params - The Prisma query parameters.
 * @returns {void}
 */
function handleDeleteManyAction(params) {
  try {
    // Check if the model supports soft deletion
    if (softDeletable.includes(params.model)) {
      // Change action to 'updateMany' and set the 'deletedAt' flag
      params.action = "updateMany";

      if (params.args.data !== undefined) {
        params.args.data.deletedAt = new Date();
      } else {
        params.args.data = { deletedAt: new Date() };
      }

      console.log(`Soft deleteMany action handled for model: ${params.model}`);
    }

    // Check if the model supports search indexing
    if (process.env.SEARCH_ENABLED) {
      if (searchable.includes(params.model)) {
        deleteSearchObjects(params.model, params.args.data);

        console.log(`Search objects deleted for model: ${params.model}`);
      }
    }

    return params;
  } catch (error) {
    console.error("Error handling deleteMany action:", error);
  }
}

main().catch((e) => {
  console.error("An error occurred while setting up Prisma middleware:", e);
});

export default prisma;
