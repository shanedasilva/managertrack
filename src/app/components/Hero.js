"use client";

import React from "react";
import Image from "next/image";

/**
 * Hero component for displaying the main hero section of the page.
 *
 * @returns {JSX.Element} JSX for the Hero component.
 */
export default function Hero() {
  return (
    <>
      <HeroImage />
      <HeroContent />
    </>
  );
}

/**
 * HeroImage component for displaying the background image.
 *
 * @returns {JSX.Element} JSX for the HeroImage component.
 */
function HeroImage() {
  return (
    <Image
      alt=""
      className="absolute bg-cover bg-center bg-no-repeat z-0 top-16"
      height="1636"
      priority={false}
      src="https://cms.jibecdn.com/prod/githubinc-careers/assets/LP-SKU-A1-IMG-BG-en-us-1704968586856.png"
      width="2245"
    />
  );
}

/**
 * HeroContent component for displaying the main content of the hero section.
 *
 * @returns {JSX.Element} JSX for the HeroContent component.
 */
function HeroContent() {
  return (
    <div className="relative isolate px-6 lg:px-8 relative py-8">
      <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-12 relative">
        <div className="text-center">
          <h1 className="text-4xl font-medium tracking-tight text-gray-900 sm:text-4xl">
            Find your dream management job without the hassle
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600 tracking-tight">
            Managertrack is where top talents go to easily access active
            management job opportunities from vetted tech companies.
          </p>

          <SearchForm />
        </div>
      </div>
    </div>
  );
}

/**
 * SearchForm component for displaying the search form.
 *
 * @returns {JSX.Element} JSX for the SearchForm component.
 */
function SearchForm() {
  return (
    <div className="mt-10 flex items-center justify-center gap-x-6">
      <form className="w-full mx-auto">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only"
        >
          Search
        </label>

        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>

          <input
            type="search"
            id="default-search"
            className="block w-full px-4 py-3 ps-10 text-base text-gray-900 border border-gray-300 shadow-sm rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search over 2000 management jobs..."
            required
          />

          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2 bg-gray-900 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-600 font-medium rounded-md text-sm px-4 py-2"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
