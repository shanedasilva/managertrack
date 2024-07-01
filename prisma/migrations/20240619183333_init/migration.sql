-- CreateEnum
CREATE TYPE "OrganizationRole" AS ENUM ('ADMIN', 'RECRUITER');

-- CreateEnum
CREATE TYPE "JobLocType" AS ENUM ('REMOTE', 'HYBRID', 'OFFICE');

-- CreateEnum
CREATE TYPE "JobCompType" AS ENUM ('SALARY', 'HOURLY');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'PAYMENT_PROCESSING', 'OPEN', 'PAUSED', 'CLOSED');

-- CreateEnum
CREATE TYPE "JobApplicationStatus" AS ENUM ('APPLIED', 'WITHDRAWN', 'INTERVIEWING', 'HIRED', 'CLOSED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT,
    "clerk_user_id" TEXT,
    "stripe_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resumes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "summary" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_educations" (
    "id" TEXT NOT NULL,
    "resume_id" TEXT NOT NULL,
    "education_level" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "currently_enrolled" BOOLEAN NOT NULL DEFAULT false,
    "enrolled_from" TIMESTAMP(3),
    "enrolled_to" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "resume_educations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_experience" (
    "id" TEXT NOT NULL,
    "resume_id" TEXT,
    "job_title" TEXT,
    "company" TEXT,
    "location" TEXT,
    "currently_employed" BOOLEAN DEFAULT false,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "resume_experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_skills" (
    "id" TEXT NOT NULL,
    "resume_id" TEXT,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "resume_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "external_id" INTEGER,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logo_url" TEXT,
    "website_url" TEXT,
    "linkedin_url" TEXT,
    "twitter_url" TEXT,
    "slug" TEXT NOT NULL,
    "featured" BOOLEAN DEFAULT false,
    "typeId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_types" (
    "id" TEXT NOT NULL,
    "external_id" INTEGER,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "organizations_users" (
    "user_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organizations_users_pkey" PRIMARY KEY ("user_id","organization_id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "external_id" INTEGER,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "apply_url" TEXT NOT NULL,
    "comp_type" "JobCompType" NOT NULL,
    "pay_scale_begin" INTEGER,
    "pay_scale_end" INTEGER,
    "pay_currency" TEXT,
    "description" TEXT NOT NULL,
    "job_location_type" "JobLocType" NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'DRAFT',
    "custom_questions" JSONB[],
    "stripe_session_id" TEXT,
    "active_until" TIMESTAMP(3),
    "job_id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "user_id" TEXT,
    "industry_id" TEXT,
    "city_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "JobApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "resume_id" TEXT NOT NULL,
    "question_answers" JSONB[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "job_tags" (
    "job_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_tags_pkey" PRIMARY KEY ("job_id","tag_id")
);

-- CreateTable
CREATE TABLE "job_cities" (
    "id" TEXT NOT NULL,
    "external_id" INTEGER,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "countryId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "job_countries" (
    "id" TEXT NOT NULL,
    "external_id" INTEGER,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "regionId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "job_regions" (
    "id" TEXT NOT NULL,
    "external_id" INTEGER,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "job_industries" (
    "id" TEXT NOT NULL,
    "external_id" INTEGER,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "job_types" (
    "id" TEXT NOT NULL,
    "external_id" INTEGER,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_clerk_user_id_key" ON "users"("clerk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_user_id_key" ON "users"("stripe_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "resumes_id_key" ON "resumes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "resumes_user_id_key" ON "resumes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "resume_educations_id_key" ON "resume_educations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "resume_experience_id_key" ON "resume_experience"("id");

-- CreateIndex
CREATE UNIQUE INDEX "resume_skills_id_key" ON "resume_skills"("id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_id_key" ON "organizations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_external_id_key" ON "organizations"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "organization_types_id_key" ON "organization_types"("id");

-- CreateIndex
CREATE UNIQUE INDEX "organization_types_external_id_key" ON "organization_types"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "organization_types_slug_key" ON "organization_types"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_users_user_id_key" ON "organizations_users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_users_organization_id_key" ON "organizations_users"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "tag_id_key" ON "tag"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_id_key" ON "jobs"("id");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_external_id_key" ON "jobs"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_slug_key" ON "jobs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_stripe_session_id_key" ON "jobs"("stripe_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_applications_id_key" ON "job_applications"("id");

-- CreateIndex
CREATE UNIQUE INDEX "job_tags_job_id_key" ON "job_tags"("job_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_tags_tag_id_key" ON "job_tags"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_cities_id_key" ON "job_cities"("id");

-- CreateIndex
CREATE UNIQUE INDEX "job_cities_external_id_key" ON "job_cities"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_cities_slug_key" ON "job_cities"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "job_countries_id_key" ON "job_countries"("id");

-- CreateIndex
CREATE UNIQUE INDEX "job_countries_external_id_key" ON "job_countries"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_countries_code_key" ON "job_countries"("code");

-- CreateIndex
CREATE UNIQUE INDEX "job_countries_name_key" ON "job_countries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "job_countries_slug_key" ON "job_countries"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "job_regions_id_key" ON "job_regions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "job_regions_external_id_key" ON "job_regions"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_regions_name_key" ON "job_regions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "job_regions_slug_key" ON "job_regions"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "job_industries_id_key" ON "job_industries"("id");

-- CreateIndex
CREATE UNIQUE INDEX "job_industries_external_id_key" ON "job_industries"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_industries_slug_key" ON "job_industries"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "job_types_id_key" ON "job_types"("id");

-- CreateIndex
CREATE UNIQUE INDEX "job_types_external_id_key" ON "job_types"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_types_slug_key" ON "job_types"("slug");

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_educations" ADD CONSTRAINT "resume_educations_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_experience" ADD CONSTRAINT "resume_experience_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_skills" ADD CONSTRAINT "resume_skills_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "organization_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations_users" ADD CONSTRAINT "organizations_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations_users" ADD CONSTRAINT "organizations_users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_industry_id_fkey" FOREIGN KEY ("industry_id") REFERENCES "job_industries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "job_cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_tags" ADD CONSTRAINT "job_tags_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_tags" ADD CONSTRAINT "job_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_cities" ADD CONSTRAINT "job_cities_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "job_countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_countries" ADD CONSTRAINT "job_countries_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "job_regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
