import Image from "next/image";

export default function FeaturedJob({ job }) {
  return (
    <div
      key={Math.random()}
      className="rounded-md border border-gray-300 bg-white shadow-sm z-50"
    >
      <div className="relative flex items-center space-x-3 px-4 pt-4 bg-white rounded-md">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-lg relative">
            <a href="#">
              <Image
                alt={job.name}
                className="rounded-lg"
                fill={true}
                src={job.imageUrl}
                style={{ objectFit: "cover" }}
              />
            </a>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-medium leading-6 text-gray-900 hover:underline cursor-pointer">
            {job.name}
          </p>
          <p className="truncate text-sm text-gray-500">
            1000-10,000 employees
          </p>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-900 px-4 pt-4">
          Building awesome, scalable apps to power the future of tech
        </p>
      </div>

      <div className="pt-2 px-4 pt-5 pb-24">
        {/* {Array.from({
          length: Math.random() * (5 - 1) + 1,
        }).map((_, index) => (
          <span
            index={Math.random()}
            className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mr-2"
          >
            Badge
          </span>
        ))} */}
      </div>

      <div className="border-t border-gray-300">
        <a
          href=""
          className="text-sm text-gray-900 flex px-4 py-3 hover:bg-gray-100 hover:underline"
        >
          12 open positions
        </a>
      </div>
    </div>
  );
}
