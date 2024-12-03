// eslint-disable-next-line no-unused-vars
import React from "react";
import { useLocation } from "react-router-dom";
import { IconButton, useMediaQuery } from "@mui/material";
import { MenuOutlined } from "@mui/icons-material";
import { useSidebar } from "../../context/SidebarContext";

const Navbar = () => {
  const location = useLocation();
  const { setCollapsed } = useSidebar();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

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
      {!isDesktop && (
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          <MenuOutlined />
        </IconButton>
      )}
      <h1 className="text-xl font-bold">{getTitle(location.pathname)}</h1>
    </div>
  );
};

export default Navbar;
