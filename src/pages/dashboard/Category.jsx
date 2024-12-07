// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import Sidebar from "../../assets/components/Sidebar";
import Navbar from "../../assets/components/Navbar";
// import { useMediaQuery } from "@mui/material";

import {
  DescriptionOutlined,
  Print,
  Replay,
  KeyboardDoubleArrowLeftRounded,
  KeyboardDoubleArrowRightRounded,
  ModeEditOutlineRounded,
  DeleteOutlined,
  VisibilityOutlined,
  ArrowDropDownOutlined,
} from "@mui/icons-material";

const CategoryTable = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="flex flex-col md:flex-row overflow-x-hidden">
      <Sidebar
      // isi
      />
      <div className="flex-1 bg-gray-100 p-4 sm:p-6">
        <Navbar
        // isi
        />
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <button className="btn btn-primary text-white">
              Add Category +
            </button>
            <div className="flex space-x-2">
              {/* Button Excel */}
              <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300">
                <DescriptionOutlined className="mr-2" />
                Excel
              </button>
              {/* Button Print */}
              <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300">
                <Print className="mr-2" />
                Print
              </button>
              {/* Button Reload */}
              <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300">
                <Replay className="mr-2" />
                Reload
              </button>
            </div>
          </div>

          <hr className="border-t border-gray-300 mb-4" />

          <div className="flex justify-between items-center mb-4">
            <div>
              <span>Show</span>
              <select className="mx-2 border border-gray-300 rounded px-2 py-1 focus:ring focus:ring-blue-200">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              entries
            </div>
            <div>
              <input
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-1 focus:ring focus:ring-blue-200"
                placeholder="Search"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full border border-gray-300 border-collapse">
              <thead>
                <tr className="bg-gray-200 text-center text-sm">
                  <th className="border border-gray-300 px-4 py-2">
                    Category Code
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Category Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Products Count
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">CA_01</td>
                  <td className="border border-gray-300 px-4 py-2">Random</td>
                  <td className="border border-gray-300 px-4 py-2">0</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {/* Tombol Desktop */}
                    <div className="hidden md:flex space-x-1 justify-center items-center">
                      <button className="btn btn-sm btn-primary text-white flex items-center justify-center px-2 py-1 group">
                        Edit
                        <ModeEditOutlineRounded className="group-hover:text-white transition duration-300" />
                      </button>
                      <button className="btn btn-sm btn-primary text-white flex items-center justify-center px-2 py-1 group">
                        View
                        <VisibilityOutlined className="group-hover:text-white transition duration-300" />
                      </button>
                      <button className="btn btn-sm btn-error text-white flex items-center justify-center px-2 py-1 group">
                        Delete
                        <DeleteOutlined className="group-hover:text-white transition duration-300" />
                      </button>
                    </div>
                    <div className="md:hidden relative">
                      <button
                        className="btn btn-sm btn-primary text-white flex items-center justify-center px-2 py-1"
                        onClick={toggleDropdown}
                      >
                        <ArrowDropDownOutlined />
                      </button>
                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-md z-10">
                          <button
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => alert("Edit clicked")}
                          >
                            Edit
                          </button>
                          <button
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => alert("View clicked")}
                          >
                            View
                          </button>
                          <button
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => alert("Delete clicked")}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm self-center">
              Showing 1 to 1 of 1 entries
            </span>
            <div className="flex items-center space-x-2">
              <button className="btn btn-outline btn-sm btn-primary text-white flex items-center justify-center px-2 py-1 group">
                <KeyboardDoubleArrowLeftRounded className="group-hover:text-white transition duration-300" />
              </button>
              <button className="btn btn-sm btn-primary text-white px-3 py-1">
                1
              </button>
              <button className="btn btn-outline btn-sm btn-primary text-white flex items-center justify-center px-2 py-1 group">
                <KeyboardDoubleArrowRightRounded className="text-gray-400 group-hover:text-white transition duration-300" />
              </button>
            </div>
          </div>
        </div>
        <footer className="mt-8 text-center text-sm text-gray-500">
          ATZuperrr Cashier © 2024 || Developed by{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Achmad Tirto Sudiro
          </a>
        </footer>
      </div>
    </div>
  );
};

export default CategoryTable;
