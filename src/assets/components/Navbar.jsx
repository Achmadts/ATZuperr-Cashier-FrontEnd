// eslint-disable-next-line no-unused-vars
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// eslint-disable-next-line react/prop-types
const Navbar = ({ userName, loading }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex items-center space-x-2">
        {loading ? (
          <>
            <Skeleton width={100} />
            <div className="w-2.5 h-2.5 rounded-full bg-gray-500"></div>
            <Skeleton width={50} />
          </>
        ) : (
          <>
            <span className="text-gray-700">{userName}</span>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            <span>Online</span>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
