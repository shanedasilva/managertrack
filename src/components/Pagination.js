import Link from "next/link";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";

export default function Pagination({ metadata, url }) {
  const {
    isFirstPage,
    isLastPage,
    currentPage,
    previousPage,
    nextPage,
    pageCount,
  } = metadata;

  const renderPageNumbers = () => {
    const pages = [];

    // Previous page (current - 1)
    if (currentPage > 1) {
      pages.push(currentPage - 1);
    }

    // Current page
    pages.push(currentPage);

    // Next page (current + 1)
    if (currentPage < pageCount) {
      pages.push(currentPage + 1);
    }

    if (isFirstPage) {
      pages.push(currentPage + 2);
    }

    // Ellipsis if needed
    if (currentPage < pageCount - 3) {
      pages.push("...");
    }

    // Last three pages
    for (
      let i = Math.max(pageCount - 2, currentPage + 2);
      i <= pageCount;
      i++
    ) {
      pages.push(i);
    }

    return pages.map((page, index) =>
      typeof page === "number" ? (
        <Link
          className={`inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 ${
            page === currentPage ? "border-slate-500 border-slate" : ""
          }`}
          href={{ pathname: url, query: { page: page } }}
          key={index}
        >
          {page}
        </Link>
      ) : (
        <span key={index} className="px-4 py-2 mx-1">
          {page}
        </span>
      )
    );
  };

  return (
    <nav className="flex items-center justify-between px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        <Link
          className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-slate-500 hover:border-slate-300 hover:text-slate-700"
          href={{ pathname: url, query: { page: previousPage } }}
        >
          <ArrowLongLeftIcon
            className="mr-3 h-5 w-5 text-slate-500"
            aria-hidden="true"
          />
          Previous
        </Link>
      </div>

      <div className="hidden md:-mt-px md:flex">{renderPageNumbers()}</div>

      <div className="-mt-px flex w-0 flex-1 justify-end">
        <Link
          className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-slate-500 hover:border-slate-300 hover:text-slate-700"
          href={{ pathname: url, query: { page: nextPage } }}
        >
          Next
          <ArrowLongRightIcon
            className="ml-3 h-5 w-5 text-slate-500"
            aria-hidden="true"
          />
        </Link>
      </div>
    </nav>
  );
}
