import { PrismaClient } from "@prisma/client";

// Declare the prisma variable to hold the PrismaClient instance
let prisma = null;

// List of models that support soft deletion
const softDeletable = ["User", "Organization", "Tag", "Job", "JobApplication"];

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
   * Middleware to handle various actions for models that support soft deletion and/or search indexing.
   * Intercepts create, update, find, and delete actions to apply necessary modifications.
   *
   * @param {Object} params - The Prisma query parameters.
   * @param {Function} next - The next middleware or query execution function.
   * @returns {Promise<Object>} - The result of the next middleware or query execution.
   */
  prisma.$use(async (params, next) => {
    // Handle the action based on its type
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
    if (softDeletable.includes(params.model)) {
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
    // if (softDeletable.includes(params.model)) {
    //   params.args.where = { ...params.args.where, deletedAt: null };
    //   console.log(
    //     `FindMany action handled for model with soft delete: ${params.model}`
    //   );
    // }

    return params;
  } catch (error) {
    console.error("Error handling findMany action:", error);
  }
}

/**
 * Handles the delete action for models that support soft deletion.
 * Changes the action to 'update' and sets the 'deletedAt' flag.
 * Deletes the object from the search index if applicable.
 *
 * @param {Object} params - The Prisma query parameters.
 * @returns {Object} - The modified Prisma query parameters.
 */
function handleDeleteAction(params) {
  try {
    if (softDeletable.includes(params.model)) {
      params.action = "update";
      params.args.data = { deletedAt: new Date() };
      console.log(`Soft delete action handled for model: ${params.model}`);
    }

    if (process.env.SEARCH_ENABLED && searchable.includes(params.model)) {
      deleteSearchObjects(params.model, [params.args.data]);
      console.log(`Search objects deleted for model: ${params.model}`);
    }

    return params;
  } catch (error) {
    console.error("Error handling delete action:", error);
  }
}

main().catch((e) => {
  console.error("An error occurred while setting up Prisma middleware:", e);
});

export default prisma;
