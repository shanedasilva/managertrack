import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Hero() {
  return (
    <div className="bg-white py-16 lg:py-32 sm:py-48 lg:pt-32 lg:pb-24">
      <div className="lg:w-max-full mb-6 mt-10 lg:mt-20 flex flex-row items-center justify-between md:mb-8 lg:mt-8 xl:mx-auto xl:max-w-screen-xxl">
        <div className="hidden shrink lg:block">
          <img
            alt=""
            className="h-[180px] xl:h-[250px]"
            loading="lazy"
            src="https://wellfound.com/images/jobs/hero-1.png"
          />
        </div>

        <div className="w-full shrink-0 px-4 md:px-10 text-center lg:w-auto xl:px-12">
          <h1 className="mb-4 mt-6 text-xl font-medium uppercase tracking-widest lg:mb-3">
            Over 10k executive & management jobs
          </h1>
          <h2 className="text-2xl font-bold !leading-[1.2] md:mb-10 md:text-5xl xxl:text-[4.5rem]">
            Find what&apos;s next<span className="text-red-600">:</span>
          </h2>

          <SearchBar />
        </div>

        <div className="hidden shrink lg:block">
          <img
            alt=""
            className="h-[180px] xl:h-[250px]"
            loading="lazy"
            src="https://wellfound.com/images/jobs/hero-2.png"
          />
        </div>
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <div className="mt-10 w-full flex gap-x-6">
      <div className="bg-background/95 p-0 sm:p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
        <form>
          <div className="relative">
            <Search className="absolute left-4 top-4 mt-1 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="indent-5 px-6 py-7 text-base bg-white border-slate-900"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
