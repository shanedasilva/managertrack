/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `job_cities` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `job_countries` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `job_industries` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `job_regions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `job_types` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "job_cities" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "job_countries" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "job_industries" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "job_regions" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "job_types" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "job_cities_slug_key" ON "job_cities"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "job_countries_slug_key" ON "job_countries"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "job_industries_slug_key" ON "job_industries"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "job_regions_slug_key" ON "job_regions"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "job_types_slug_key" ON "job_types"("slug");
