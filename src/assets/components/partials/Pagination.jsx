// eslint-disable-next-line no-unused-vars
import React from "react";
import {
  KeyboardDoubleArrowLeftRounded,
  KeyboardDoubleArrowRightRounded,
} from "@mui/icons-material";

const Pagination = () => {
  return (
    <div className="flex justify-between items-center mt-4">
      <span className="text-sm self-center">Showing 1 to 1 of 1 entries</span>
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
  );
};

export default Pagination;
