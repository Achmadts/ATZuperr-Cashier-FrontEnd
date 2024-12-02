// eslint-disable-next-line no-unused-vars
import React from "react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const getTitle = (pathname) => {
    switch (pathname) {
      case "/dashboard/home":
        return "Dashboard";
      case "/dashboard/profile-password":
        return "Update Profile & Password";
      case "/products":
        return "Products";
      case "/sales":
        return "Sales";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-bold">{getTitle(location.pathname)}</h1>
    </div>
  );
};

export default Navbar;
