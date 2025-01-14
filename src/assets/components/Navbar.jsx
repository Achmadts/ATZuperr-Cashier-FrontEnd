// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { IconButton, useMediaQuery, Skeleton } from "@mui/material";
import { MenuOutlined } from "@mui/icons-material";
import { useSidebar } from "../../context/SidebarContext";

const Navbar = () => {
  const location = useLocation();
  const { setCollapsed } = useSidebar();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const getTitle = (pathname) => {
    switch (pathname) {
      case "/dashboard/home":
        return "Dashboard";
      case `/dashboard/profile-password/${id}`:
        return "Update Profile & Password";
      
      case "/dashboard/products":
        return "Products";
      case "/dashboard/products/add":
        return "Add Products";
      case `/dashboard/products/edit/${id}`:
        return "Edit Products";
      case `/dashboard/products/details/${id}`:
        return "Details Products";
      
      case "/dashboard/categories":
        return "Categories";
      case `/dashboard/categories/edit/${id}`:
        return "Edit Category";
      case `/dashboard/categories/add`:
        return "Add Category";
      
      case "/dashboard/sales":
        return "Sales";
      case "/dashboard/sales/add":
        return "Add Sales";
      case `/dashboard/sales/edit/${id}`:
        return "Edit Sale";
      case `/dashboard/sales/details/${id}`:
        return "Details Sale";
      default:
        return "Dashboard";
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center gap-4 mb-6">
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
      {loading ? (
        <Skeleton variant="text" width={260} height={40} />
      ) : (
        <h1 className="text-xl font-bold">{getTitle(location.pathname)}</h1>
      )}
    </div>
  );
};

export default Navbar;
