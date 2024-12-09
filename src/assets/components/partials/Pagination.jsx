// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import Skeleton from "@mui/material/Skeleton";
import {
  KeyboardDoubleArrowLeftRounded,
  KeyboardDoubleArrowRightRounded,
} from "@mui/icons-material";

// eslint-disable-next-line react/prop-types
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-between items-center mt-4">
      {loading ? (
        <Skeleton variant="text" width={200} height={20} />
      ) : (
        <span className="text-sm self-center">
          Showing {currentPage} of {totalPages} entries
        </span>
      )}

      <div className="flex items-center space-x-2">
        {loading ? (
          <>
            <Skeleton variant="rectangular" width={30} height={30} />
            <Skeleton variant="rectangular" width={30} height={30} />
            <Skeleton variant="rectangular" width={30} height={30} />
          </>
        ) : (
          <>
            {currentPage > 1 && (
              <button
                className="btn btn-sm btn-primary text-white flex items-center justify-center px-2 py-1 group"
                onClick={handlePrev}
              >
                <KeyboardDoubleArrowLeftRounded className="group-hover:text-white transition duration-300" />
              </button>
            )}
            <button className="btn btn-sm btn-primary text-white px-3 py-1">
              {currentPage}
            </button>
            {currentPage < totalPages && (
              <button
                className="btn btn-sm btn-primary text-white flex items-center justify-center px-2 py-1 group"
                onClick={handleNext}
              >
                <KeyboardDoubleArrowRightRounded className="text-gray-400 group-hover:text-white transition duration-300" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Pagination;
