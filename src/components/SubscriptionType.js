import { useState } from "react";
import { Radio, RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

const mailingLists = [
  {
    id: 1,
    title: "One-Time 30 Days",
    description: "Post you job for 30 days",
    users: "$299",
    price_code: "price_1PO4P9HWCFf8SDJTyfNtIL1F",
  },
  {
    id: 2,
    title: "Recurring 30 Days",
    description: "Renew your job posting every 30 days until you fill the role",
    users: "$299/month",
    price_code: "price_1PP8PeHWCFf8SDJTuFWbfMW4",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SubscriptionType() {
  const [selectedMailingLists, setSelectedMailingLists] = useState(
    mailingLists[0].price_code
  );

  return (
    <fieldset>
      <RadioGroup
        value={selectedMailingLists}
        onChange={setSelectedMailingLists}
        className="mt-2 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4"
      >
        {mailingLists.map((mailingList) => (
          <Radio
            key={mailingList.id}
            value={mailingList.price_code}
            aria-label={mailingList.title}
            aria-description={`${mailingList.description} to ${mailingList.users}`}
            className={({ focus }) =>
              classNames(
                focus ? "border-gray-900 ring-1 ring-gray-900" : "",
                !focus ? "border-gray-300" : "",
                "relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
              )
            }
          >
            {({ checked, focus }) => (
              <>
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900">
                      {mailingList.title}
                    </span>
                    <span className="mt-1 flex items-center text-sm text-gray-500">
                      {mailingList.description}
                    </span>
                    <span className="mt-6 text-sm font-medium text-gray-900">
                      {mailingList.users}
                    </span>
                  </span>
                </span>
                <CheckCircleIcon
                  className={classNames(
                    !checked ? "invisible" : "",
                    "h-5 w-5 text-gray-900"
                  )}
                  aria-hidden="true"
                />
                <span
                  className={classNames(
                    checked ? "border-gray-900" : "border-transparent",
                    focus ? "border" : "border",
                    "pointer-events-none absolute -inset-px rounded-lg"
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </Radio>
        ))}
      </RadioGroup>
    </fieldset>
  );
}
