import { PrismaClient } from "@prisma/client";

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
    // Check incoming query type for the Post model
    if (softDeletable.includes(params.model)) {
      if (params.action === "delete") {
        // Intercept delete queries and change action to update with a deleted flag
        params.action = "update";
        params.args["data"] = { deleted_at: new Date() };
      }

      if (params.action === "deleteMany") {
        // Intercept deleteMany queries and change action to updateMany with a deleted flag
        params.action = "updateMany";

        if (params.args.data !== undefined) {
          params.args.data["deleted_at"] = new Date();
        } else {
          params.args["data"] = { deleted_at: new Date() };
        }
      }
    }

    // Execute the next middleware or query
    return next(params);
  });
}

main().catch((e) => {
  console.error("An error occurred while setting up Prisma middleware:", e);
});

export default prisma;
