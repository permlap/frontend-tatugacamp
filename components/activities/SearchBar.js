import React from "react";

function SearchBar(props) {
  const handleSumit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputObject = Object.fromEntries(formData);
    props.searchOption(inputObject);
  };
  return (
    <div className="mb-14 relative ">
      <form className="text-white flex justify-center " onSubmit={handleSumit}>
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only"
        >
          Search
        </label>
        <select name="species" autoFocus className="absolute top-16">
          <option value="">All</option>
          <option value="Human">Human</option>
          <option value="Alien">Alien</option>
        </select>
        <div className="relative">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-white "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="search"
            name="activities"
            id="default-search"
            className="block p-4 pl-10 w-96 text-sm placeholder-white text-white bg-[#2C7CD1] rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
            placeholder="Search for activity, such as Taboo......."
          />
          <button
            type="submit"
            className="text-white absolute right-2.5 bottom-2.5 bg-[#97CC04] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 "
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
