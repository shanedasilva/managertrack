import { PrismaClient } from "@prisma/client";
import {
  createSearchObjects,
  updateSearchObjects,
  deleteSearchObjects,
} from "@/lib/search/client";

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
  prisma = new PrismaClient({
    errorFormat: "pretty",
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      errorFormat: "pretty",
    });
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
    // Handle handle any post processing actions
    switch (params.action) {
      case "find":
        params = await handleFindAction(params);
        break;
      case "findMany":
        params = await handleFindManyAction(params);
        break;
      default:
        break;
    }

    // Execute the next middleware or query
    const executed = await next(params);

    // Handle handle any post processing actions
    switch (params.action) {
      case "create":
        handleCreateAction(params, executed);
        break;
      case "createMany":
        handleCreateManyAction(params, executed);
        break;
      case "update":
        handleUpdateAction(params, executed);
        break;
      case "updateMany":
        handleUpdateManyAction(params, executed);
        break;
      case "delete":
        handleDeleteAction(params, executed);
        break;
      case "deleteMany":
        handleDeleteManyAction(params, executed);
        break;
      default:
        break;
    }

    return executed;
  });
}

/**
 * Handles the create action for models that support search indexing.
 * Adds the created object to the search index.
 *
 * @param {Object} params - The Prisma query parameters.
 * @returns {Object} - The modified Prisma query parameters.
 */
function handleCreateAction(params, data) {
  try {
    if (process.env.SEARCH_ENABLED && searchable.includes(params.model)) {
      createSearchObjects(params.model, data);
    }

    return params;
  } catch (error) {
    console.error("Error handling create action:", error);
  }
}

/**
 * Handles the createMany action for models that support search indexing.
 * Adds the created objects to the search index.
 *
 * @param {Object} params - The Prisma query parameters.
 * @returns {Object} - The modified Prisma query parameters.
 */
function handleCreateManyAction(params, data) {
  try {
    if (process.env.SEARCH_ENABLED && searchable.includes(params.model)) {
      createSearchObjects(params.model, data);
    }

    return params;
  } catch (error) {
    console.error("Error handling createMany action:", error);
  }
}

/**
 * Handles the update action for models that support search indexing.
 * Updates the search index with the modified object.
 *
 * @param {Object} params - The Prisma query parameters.
 * @returns {Object} - The modified Prisma query parameters.
 */
function handleUpdateAction(params, data) {
  try {
    if (process.env.SEARCH_ENABLED && searchable.includes(params.model)) {
      updateSearchObjects(params.model, [data]);
    }

    return params;
  } catch (error) {
    console.error("Error handling update action:", error);
  }
}

/**
 * Handles the updateMany action for models that support search indexing.
 * Updates the search index with the modified objects.
 *
 * @param {Object} params - The Prisma query parameters.
 * @returns {Object} - The modified Prisma query parameters.
 */
function handleUpdateManyAction(params, data) {
  try {
    if (process.env.SEARCH_ENABLED && searchable.includes(params.model)) {
      updateSearchObjects(params.model, data);
    }

    return params;
  } catch (error) {
    console.error("Error handling updateMany action:", error);
  }
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
      params.args = params.args || {};
      params.args.where = params.args.where || {};
      params.args.where.deletedAt = null;
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
    if (softDeletable.includes(params.model)) {
      params.args = params.args || {};
      params.args.where = params.args.where || {};
      params.args.where.deletedAt = null;
    }

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
function handleDeleteAction(params, data) {
  try {
    if (softDeletable.includes(params.model)) {
      params.action = "update";
      params.args.data = { deletedAt: new Date() };

      params.args = params.args || {};
      params.args.data = params.args.data || {};
      params.args.data.deletedAt = new Date();
    }

    if (process.env.SEARCH_ENABLED && searchable.includes(params.model)) {
      deleteSearchObjects(params.model, [data]);
    }

    return params;
  } catch (error) {
    console.error("Error handling delete action:", error);
  }
}

/**
 * Handles the deleteMany action for models that support soft deletion.
 * Changes the action to 'updateMany' and sets the 'deletedAt' flag.
 * Deletes the objects from the search index if applicable.
 *
 * @param {Object} params - The Prisma query parameters.
 * @returns {Object} - The modified Prisma query parameters.
 */
function handleDeleteManyAction(params, data) {
  try {
    if (softDeletable.includes(params.model)) {
      params.action = "updateMany";

      params.args = params.args || {};
      params.args.where = params.args.where || {};
      params.args.where.deletedAt = new Date();
    }

    if (process.env.SEARCH_ENABLED && searchable.includes(params.model)) {
      deleteSearchObjects(params.model, data);
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
