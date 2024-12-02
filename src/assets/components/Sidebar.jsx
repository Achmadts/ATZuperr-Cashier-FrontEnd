// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import {
  DashboardOutlined,
  ContactsOutlined,
  ReceiptOutlined,
  PersonOutlined,
  CalendarTodayOutlined,
  HomeOutlined,
  SettingsOutlined,
  MenuOutlined,
} from "@mui/icons-material";
import { useSidebar } from "../../context/SidebarContext";
import avatar from "../../assets/images/avatar.png";
import logo from "../../assets/images/logo.png";
import endpoints from "../../constants/apiEndpoint";

const SideBar = () => {
  const { collapsed, setCollapsed } = useSidebar();
  const [setIsAdmin] = useState(null);
  const [userName, setUserName] = useState("Loading...");
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await fetch(endpoints.user, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const data = await response.json();

          if (data && data.user) {
            setUserName(data.user.name || "User");
            setIsAdmin(data.user.is_admin);
          } else {
            console.error("Invalid user data");
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchUserData();
  }, [setIsAdmin]);

  const confirmLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
      collapsed={collapsed}
      toggled={true}
      breakPoint="md"
      onBackdropClick={() => setCollapsed(!collapsed)}
    >
      <Menu
        menuItemStyles={{ button: { ":hover": { background: "transparent" } } }}
      >
        <MenuItem>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            {!collapsed && (
              <Box display="flex" alignItems="center" gap="12px">
                <img
                  src={logo}
                  alt="Logo"
                  style={{ width: "30px", height: "30px" }}
                />
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color={colors.greenAccent[500]}
                  sx={{ fontSize: "15px" }}
                >
                  ATZuperrr Cashier
                </Typography>
              </Box>
            )}
            <IconButton onClick={() => setCollapsed(!collapsed)}>
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>

        {!collapsed && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap="10px"
            mb="25px"
          >
            <Avatar
              alt="avatar"
              src={avatar}
              sx={{ width: "100px", height: "100px" }}
            />
            <Box textAlign="center">
              <Typography
                variant="h5"
                fontWeight="bold"
                color={colors.gray[100]}
                sx={{ fontSize: "18px" }}
              >
                {userName}
              </Typography>
              <Typography
                variant="body2"
                fontWeight="500"
                color={colors.greenAccent[500]}
                sx={{ fontSize: "14px" }}
              >
                Super Admin
              </Typography>
            </Box>
          </Box>
        )}

        <Box pl={collapsed ? undefined : "5%"}>
          <Menu menuItemStyles={{ button: { ":hover": { color: "#868dfb" } } }}>
            <MenuItem
              icon={<DashboardOutlined />}
              onClick={() => navigate("/")}
            >
              Dashboard
            </MenuItem>
            <MenuItem icon={<HomeOutlined />} onClick={() => navigate("/team")}>
              Home
            </MenuItem>
            <MenuItem
              icon={<ContactsOutlined />}
              onClick={() => navigate("/home")}
            >
              Products
            </MenuItem>
            <MenuItem
              icon={<ReceiptOutlined />}
              onClick={() => navigate("/products")}
            >
              Purchases
            </MenuItem>
            <MenuItem
              icon={<PersonOutlined />}
              onClick={() => navigate("/purchases")}
            >
              Sales
            </MenuItem>
            <MenuItem
              icon={<CalendarTodayOutlined />}
              onClick={() => navigate("/sales")}
            >
              Expenses
            </MenuItem>
            <MenuItem
              icon={<SettingsOutlined />}
              onClick={() => navigate("/expenses")}
            >
              Settings
            </MenuItem>
            <MenuItem icon={<PersonOutlined />} onClick={confirmLogout}>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Menu>
    </Sidebar>
  );
};

export default SideBar;
