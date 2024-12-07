// eslint-disable-next-line no-unused-vars
import React from "react";

const FilterSection = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
      <div className="w-full md:w-auto mb-2 md:mb-0">
        <span>Show</span>
        <select className="mx-2 border border-gray-300 rounded px-2 py-1 focus:ring focus:ring-blue-200">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        entries
      </div>

      <div className="w-full md:w-auto">
        <input
          type="text"
          className="w-full md:w-auto border border-gray-300 rounded-lg px-3 py-1 focus:ring focus:ring-blue-200"
          placeholder="Search"
        />
      </div>
    </div>
  );
};

export default FilterSection;
