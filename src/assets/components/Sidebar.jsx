// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Typography,
  useTheme,
  Skeleton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  useMediaQuery,
  Collapse,
} from "@mui/material";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import {
  DashboardOutlined,
  Inventory2Outlined,
  ReceiptOutlined,
  PersonOutlined,
  CloseOutlined,
  LogoutOutlined,
  CalendarTodayOutlined,
  SettingsOutlined,
  MenuOutlined,
  ExpandMoreOutlined,
  ExpandLessOutlined,
  CategoryOutlined,
  AddCircleOutlined,
  QrCode2Outlined,
} from "@mui/icons-material";
import { useSidebar } from "../../context/SidebarContext";
import logo from "../../assets/images/logo.png";
import endpoints from "../../constants/apiEndpoint";

const SideBar = () => {
  const { collapsed, setCollapsed } = useSidebar();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const [isAdmin, setIsAdmin] = useState(null);
  const [id, setId] = useState(null);
  const [userName, setUserName] = useState("Loading...");
  const [images, setImages] = useState(null);
  const [menuLoading, setMenuLoading] = useState(true);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);

  const token = localStorage.getItem("access_token");
  useEffect(() => {
    if (isSmallScreen) {
      setCollapsed(true);
    }

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
            setUserName(data.user.name || null);
            setIsAdmin(data.user.is_admin);
            setImages(data.user.images);
            setId(data.user.id);
          } else {
            console.error("Invalid user data");
          }
        } catch (error) {
          console.error(error);
        } finally {
          setMenuLoading(false);
        }
      } else {
        setMenuLoading(false);
      }
    };

    fetchUserData();
  }, [isSmallScreen, setCollapsed, token]);

  const confirmLogout = () => {
    setOpenLogoutModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const handleClose = () => {
    setOpenLogoutModal(false);
  };

  const handleExpandClick = (menuName) => {
    setExpandedMenu((prev) => (prev === menuName ? null : menuName));
  };

  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
      collapsed={isSmallScreen ? false : collapsed}
      toggled={!isSmallScreen ? true : !collapsed}
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
            {!collapsed && !isSmallScreen && (
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
              {collapsed ? <MenuOutlined /> : <CloseOutlined />}{" "}
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
            {menuLoading ? (
              <>
                <Skeleton variant="circular" width={100} height={100} />
                <Box textAlign="center">
                  <Skeleton variant="text" width={100} height={30} />
                  <Skeleton variant="text" width={100} height={25} />
                </Box>
              </>
            ) : (
              <>
                <Avatar
                  alt={userName}
                  src={`http://localhost:8000/storage/${images}`}
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
                    {isAdmin === 1 ? "Admin" : "User"}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        )}

        <Box pl={collapsed ? undefined : "5%"}>
          {menuLoading ? (
            <Box>
              <Skeleton variant="text" width="70%" height={50} />
              <Skeleton variant="text" width="70%" height={50} />
              <Skeleton variant="text" width="70%" height={50} />
              <Skeleton variant="text" width="70%" height={50} />
              <Skeleton variant="text" width="70%" height={50} />
              <Skeleton variant="text" width="70%" height={50} />
              <Skeleton variant="text" width="70%" height={50} />
            </Box>
          ) : (
            <Menu
              menuItemStyles={{ button: { ":hover": { color: "#868dfb" } } }}
            >
              <MenuItem
                icon={<DashboardOutlined />}
                onClick={() => navigate("/dashboard/home")}
                style={{
                  color:
                    location.pathname === "/dashboard/home"
                      ? "#868dfb"
                      : undefined,
                }}
              >
                Dashboard
              </MenuItem>
              <MenuItem
                icon={<Inventory2Outlined />}
                onClick={() => handleExpandClick("products")}
                style={{
                  color: location.pathname.includes("/dashboard/products")
                    ? "#868dfb"
                    : undefined,
                }}
                suffix={
                  expandedMenu === "products" ? (
                    <ExpandLessOutlined />
                  ) : (
                    <ExpandMoreOutlined />
                  )
                }
              >
                Products
              </MenuItem>
              <Collapse in={expandedMenu === "products"}>
                <Box
                  pl={4}
                  className="max-h-[300px] overflow-y-auto scrollbar-hide"
                >
                  <MenuItem
                    icon={<CategoryOutlined />}
                    onClick={() => navigate("/dashboard/categories")}
                  >
                    Categories
                  </MenuItem>
                  <MenuItem
                    icon={<AddCircleOutlined />}
                    onClick={() => navigate("/dashboard/product/create")}
                  >
                    Create Product
                  </MenuItem>
                  <MenuItem
                    icon={<Inventory2Outlined />}
                    onClick={() => navigate("/dashboard/products")}
                  >
                    All Products
                  </MenuItem>
                  <MenuItem
                    icon={<QrCode2Outlined />}
                    onClick={() => navigate("/dashboard/printBarcode")}
                  >
                    Print Barcode
                  </MenuItem>
                </Box>
              </Collapse>
              <MenuItem
                icon={<ReceiptOutlined />}
                onClick={() => navigate("/purchases")}
              >
                Purchases
              </MenuItem>
              <MenuItem
                icon={<PersonOutlined />}
                onClick={() => navigate("/sales")}
              >
                Sales
              </MenuItem>
              <MenuItem
                icon={<CalendarTodayOutlined />}
                onClick={() => navigate("/expenses")}
              >
                Expenses
              </MenuItem>
              <MenuItem
                icon={<SettingsOutlined />}
                onClick={() => navigate(`/dashboard/profile-password/${id}`)}
                style={{
                  color:
                    location.pathname === `/dashboard/profile-password/${id}`
                      ? "#868dfb"
                      : undefined,
                }}
              >
                Settings
              </MenuItem>
              <MenuItem icon={<LogoutOutlined />} onClick={confirmLogout}>
                Logout
              </MenuItem>
              <Dialog open={openLogoutModal} onClose={handleClose}>
                <DialogTitle>Konfirmasi Logout</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Apakah Anda yakin ingin keluar?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleClose}
                    color="primary"
                    sx={{
                      "&:hover": {
                        backgroundColor: colors.blueAccent[700],
                        color: "#fff",
                      },
                    }}
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleLogout}
                    color="error"
                    sx={{
                      "&:hover": {
                        backgroundColor: colors.redAccent[500],
                        color: "#fff",
                      },
                    }}
                  >
                    Ya
                  </Button>
                </DialogActions>
              </Dialog>
            </Menu>
          )}
        </Box>
      </Menu>
    </Sidebar>
  );
};

export default SideBar;
