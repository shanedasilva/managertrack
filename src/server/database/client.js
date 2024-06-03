import { PrismaClient } from "@prisma/client";

let prisma = null;

// Check if running in production
if (process.env.NODE_ENV === "production") {
  // Create new PrismaClient instance
  prisma = new PrismaClient();
} else {
  // Check if global PrismaClient instance exists
  if (!global.prisma) {
    // Create new PrismaClient instance and assign it to global variable
    global.prisma = new PrismaClient();
  }

  // Assign global PrismaClient instance to local variable
  prisma = global.prisma;
}

export default prisma;
