import React, { useState, Fragment, useEffect } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { BsCheckLg, BsCaretDownFill } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
function SearchAutoComplete({
  activityPosts,
  handleSelectedActivity,
  searchFor,
}) {
  const [activites, setActivities] = useState(activityPosts);
  const [firstRender, setFirstRender] = useState(true);
  const [selected, setSelected] = useState(activites[0]);
  const [query, setQuery] = useState("");

  const filteredActivities =
    query === ""
      ? activites
      : activites.filter((activity) =>
          activity.title
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  // send data seach to parent
  function handleSelectedActivity(activity) {
    handleSelectedActivity(activity);
  }
  useEffect(() => {
    if (firstRender === false) {
      handleSelectedActivity(selected);
    } else null;
    setFirstRender(false);
  }, [selected.title]);

  return (
    <div className="w-full">
      <Combobox value={selected} onChange={setSelected}>
        <Combobox.Label>
          <span className="text-sm">
            {searchFor} <CiSearch size={20} />
          </span>
        </Combobox.Label>
        <div className="relative mt-1">
          <Combobox.Input
            as="input"
            placeholder="ค้นหาได้เลย.."
            type="text"
            className="w-72  h-10 placeholder:pl-5 pl-5 border-none ring-2 appearance-none font-sans group rounded-lg focus:ring-0 ring-[#EDBA02] bg-yellow-100  "
            displayValue={(activity) => activity.title}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button
            as="button"
            className="absolute bg-transparent text-[#EDBA02]  cursor-pointer hover:scale-125 transition duration-500 ease-in-out
           w-10 justify-center border-0 inset-y-0 right-0 flex items-center pr-2 text-xl"
          >
            <BsCaretDownFill />
          </Combobox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options
              as="ul"
              className="absolute pl-0 mt-1   max-h-60 w-[19.5rem] overflow-auto scrollbar rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              {filteredActivities.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredActivities.map((activity) => (
                  <Combobox.Option
                    onClick={() => handleSelectedActivity(activity)}
                    key={activity._id}
                    className={({ active }) =>
                      `relative cursor-default select-none list-none  py-2 ${
                        active ? "bg-teal-200  " : "text-gray-900"
                      }`
                    }
                    value={activity}
                  >
                    {({ selected, active }) => (
                      <button className="w-ful bg-transparent border-0 flex ">
                        {selected && (
                          <span className="text-[#EDBA02]">
                            <BsCheckLg size={20} />
                          </span>
                        )}
                        <span
                          className={`block truncate font-sans   pl-2     ${
                            selected && "font-semibold text-black"
                          } 
                            ${active ? "font-bold " : "text-black"}`}
                        >
                          {activity.title}
                        </span>
                      </button>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}

export default SearchAutoComplete;
