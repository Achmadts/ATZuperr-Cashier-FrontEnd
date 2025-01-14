// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Line, Pie } from "react-chartjs-2";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery, Skeleton } from "@mui/material";
import { format, parseISO } from "date-fns";
import {
  CurrencyExchangeOutlined,
  ShoppingCartOutlined,
  ArrowBackOutlined,
  BarChartOutlined,
  FilterAltOutlined,
} from "@mui/icons-material";
import Sidebar from "../../assets/components/Sidebar";
import Navbar from "../../assets/components/Navbar";
import endpoints from "../../constants/apiEndpoint";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [salesPurchasesData, setSalesPurchasesData] = useState(null);
  const [overviewData, setOverviewData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Last 7 Days");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [setCollapsed] = useState(isMobile);
  const navigate = useNavigate();

  const filterOptions = {
    "7d": "Last 7 Days",
    "1m": "Last 1 Month",
    "6m": "Last 6 Months",
    YTD: "Last Year To Date",
    "1th": "Last 1 Year",
    "5th": "Last 5 Years",
    Maks: "Last All Time",
  };

  const filterMapping = {
    "7d": 7,
    "1m": 30,
    "6m": 180,
    YTD: 365,
    "1th": 365,
    "5th": 1825,
    Maks: 0,
  };

  const fetchSalesPurchasesData = async (days, filterKey) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(
        `${endpoints.getSalesPurchases}?days=${days}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sales and purchases data");
      }

      const data = await response.json();
      // console.log("Raw Data from Backend:", data);

      const salesLabels = data.sales.map((item) => item.period.toString());
      const salesData = data.sales.map((item) => parseFloat(item.total_sales));

      const purchasesLabels = data.purchases.map((item) =>
        item.period.toString()
      );
      const purchasesData = data.purchases.map((item) =>
        parseFloat(item.total_purchases)
      );

      const labels = [...new Set([...salesLabels, ...purchasesLabels])];
      // console.log("Combined Labels:", labels);

      const formattedLabels = labels.map((date) => {
        if (!date) return "N/A";

        let parsedDate;
        if (!isNaN(date)) {
          return date;
        }

        try {
          parsedDate = parseISO(date);
          // eslint-disable-next-line no-unused-vars
        } catch (error) {
          const parts = date.split("-");
          if (parts.length === 2) {
            const [year, month] = parts;
            parsedDate = new Date(year, month - 1);
          } else if (parts.length === 1) {
            parsedDate = new Date(parts[0]);
          } else {
            return date;
          }
        }

        if (["6m", "YTD", "1th"].includes(filterKey)) {
          return format(parsedDate, "MMMM");
        } else if (["5th", "Maks"].includes(filterKey)) {
          return format(parsedDate, "yyyy");
        } else {
          return format(parsedDate, "dd/MM/yyyy");
        }
      });

      const chartData = {
        labels: formattedLabels || [],
        datasets: [
          {
            label: "Sales",
            data: labels.map((date) =>
              salesLabels.includes(date)
                ? salesData[salesLabels.indexOf(date)]
                : 0
            ),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Purchases",
            data: labels.map((date) =>
              purchasesLabels.includes(date)
                ? purchasesData[purchasesLabels.indexOf(date)]
                : 0
            ),
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
        ],
      };

      setSalesPurchasesData(chartData);

      const totalSalesQuantity = data.sales.reduce(
        (acc, item) => acc + parseInt(item.total_sales_quantity, 10),
        0
      );
      const totalPurchasesQuantity = data.purchases.reduce(
        (acc, item) => acc + parseInt(item.total_purchases_quantity, 10),
        0
      );

      const overviewChartData = {
        labels: ["Sales Quantity", "Purchases Quantity"],
        datasets: [
          {
            data: [totalSalesQuantity || 0, totalPurchasesQuantity || 0],
            backgroundColor: ["#36A2EB", "#FF5733"],
          },
        ],
      };

      setOverviewData(overviewChartData);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      // console.error("Error fetching sales/purchases data:", error);
      toast.error("Failed to fetch sales and purchases data.");
    }
  };

  const handleFilterSelect = (key) => {
    const days = filterMapping[key];
    setSelectedFilter(filterOptions[key]);
    fetchSalesPurchasesData(days, key);
  };

  const handleFilterClick = () => {
    setShowFilters((prev) => !prev);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const lastInteraction = localStorage.getItem("last_interaction");

    if (token && lastInteraction) {
      const currentTime = new Date().getTime();
      const interactionTime = parseInt(lastInteraction, 10);

      if (currentTime - interactionTime > 60 * 60 * 1000) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("last_interaction");
        navigate("/");
      } else {
        const fetchUserData = async () => {
          try {
            const response = await fetch(endpoints.user, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            if (!response.ok) throw new Error("Failed to fetch user data");

            const data = await response.json();
            if (data.success && data.user) {
              setUserData(data.user);
            } else {
              throw new Error("Invalid data structure");
            }
          // eslint-disable-next-line no-unused-vars
          } catch (error) {
            // console.error("Error fetching user data:", error);
            toast.error("Failed to fetch user data.");
            navigate("/");
          }
        };

        fetchUserData();
        fetchSalesPurchasesData(7);
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("last_interaction");
    toast.success("Successfully logged out!");
    navigate("/");
  };

  return (
    <div className="flex flex-col md:flex-row overflow-x-hidden">
      <Sidebar
        handleLogout={handleLogout}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
      />
      <div className="flex-1 bg-gray-100 p-4 sm:p-6">
        {userData ? (
          <>
            <Navbar userName={userData.name} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                <div className="bg-primary p-2 rounded-full flex items-center justify-center mr-4">
                  <CurrencyExchangeOutlined className="text-neutral-100" />
                </div>
                <div className="flex flex-col">
                  <p className="text-lg sm:text-xl text-gray-700">Revenue</p>
                  <p className="text-sm sm:text-lg text-gray-500">$3000</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                <div className="bg-primary p-2 rounded-full flex items-center justify-center mr-4">
                  <ShoppingCartOutlined className="text-neutral-100" />
                </div>
                <div className="flex flex-col">
                  <p className="text-lg sm:text-xl text-gray-700">
                    Sales Return
                  </p>
                  <p className="text-sm sm:text-lg text-gray-500">$3000</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                <div className="bg-primary p-2 rounded-full flex items-center justify-center mr-4">
                  <ArrowBackOutlined className="text-neutral-100" />
                </div>
                <div className="flex flex-col">
                  <p className="text-lg sm:text-xl text-gray-700">
                    Purchases Return
                  </p>
                  <p className="text-sm sm:text-lg text-gray-500">$3000</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                <div className="bg-primary p-2 rounded-full flex items-center justify-center mr-4">
                  <BarChartOutlined className="text-neutral-100" />
                </div>
                <div className="flex flex-col">
                  <p className="text-lg sm:text-xl text-gray-700">Profit</p>
                  <p className="text-sm sm:text-lg text-gray-500">$3000</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex-1 relative">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-lg sm:text-xl text-gray-700">
                    Sales & Purchases of {selectedFilter}
                  </p>
                  <FilterAltOutlined
                    className="text-gray-500 cursor-pointer"
                    onClick={handleFilterClick}
                  />
                </div>
                {showFilters && (
                  <div className="absolute right-4 top-14 bg-white border border-gray-300 rounded-lg shadow-md z-10 w-40">
                    <ul className="py-2 text-gray-700">
                      {Object.keys(filterOptions).map((key) => (
                        <li
                          key={key}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleFilterSelect(key)}
                        >
                          {filterOptions[key]}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="w-full">
                  {salesPurchasesData &&
                  salesPurchasesData.labels?.length > 0 ? (
                    <Line data={salesPurchasesData} />
                  ) : (
                    <p className="text-gray-500 text-center">
                      No data available for the selected filter.
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md lg:max-w-md">
                <p className="text-lg sm:text-xl text-gray-700 mb-4">
                  Overview of August, 2021
                </p>
                <div className="w-full">
                  <Pie data={overviewData} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col space-y-4 sm:space-y-6">
            <Skeleton height={40} width="100%" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-white p-4 rounded-lg shadow-md flex items-center"
                  >
                    <Skeleton
                      variant="circular"
                      height={40}
                      width={40}
                      className="mr-4"
                    />
                    <div className="flex flex-col">
                      <Skeleton height={28} width="161px" className="mb-2" />
                      <Skeleton height={28} width="80px" />
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex-1">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton height={50} width="60%" />
                  <Skeleton height={50} width={30} />
                </div>
                <Skeleton height={395} width={790} />
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full md:w-1/3">
                <Skeleton height={50} width="80%" className="mb-4" />
                <Skeleton height={395} width="100%" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
