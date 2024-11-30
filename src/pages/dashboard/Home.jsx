// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Line } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import {
  CurrencyDollarIcon,
  ArrowLeftIcon,
  ShoppingCartIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

import Sidebar from "../../assets/components/Sidebar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
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
  const navigate = useNavigate();

  const salesPurchasesData = {
    labels: ["11-08-21", "12-08-21", "14-08-21", "16-08-21", "17-08-21"],
    datasets: [
      {
        label: "Sales",
        data: [1000, 2000, 1500, 4000, 3000],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Purchases",
        data: [500, 1000, 1500, 2500, 3500],
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const overviewData = {
    labels: ["Sales", "Purchases", "Expenses"],
    datasets: [
      {
        data: [3000, 2000, 1000],
        backgroundColor: ["#36A2EB", "#FF5733", "#FFCA28"],
      },
    ],
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
          } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Failed to fetch user data.");
            navigate("/");
          }
        };

        fetchUserData();
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
    <div className="flex overflow-x-hidden">
      <Sidebar handleLogout={handleLogout} />

      <div className="flex-1 bg-gray-100 p-6">
        {userData ? (
          <>
            <Navbar userName={userData.name} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <div className="flex items-center justify-center mb-1">
                  <CurrencyDollarIcon className="h-8 w-8 mr-2" />
                  <p className="text-2xl text-purple-600">$3,000.00</p>
                </div>
                <p className="text-xl text-gray-700">Revenue</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <div className="flex items-center justify-center mb-1">
                  <ArrowLeftIcon className="h-8 w-8 mr-2" />
                  <p className="text-2xl text-yellow-500">$0.00</p>
                </div>
                <p className="text-xl text-gray-700">Sales Return</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <div className="flex items-center justify-center mb-1">
                  <ShoppingCartIcon className="h-8 w-8 mr-2" />
                  <p className="text-2xl text-green-500">$0.00</p>
                </div>
                <p className="text-xl text-gray-700">Purchases Return</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <div className="flex items-center justify-center mb-1">
                  <ChartBarIcon className="h-8 w-8 mr-2" />
                  <p className="text-2xl text-blue-600">$2,200.00</p>
                </div>
                <p className="text-xl text-gray-700">Profit</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <div
                className="bg-white p-6 rounded-lg shadow-md flex-1"
                style={{ maxWidth: "800px" }}
              >
                <p className="text-xl text-gray-700 mb-4">
                  Sales & Purchases of Last 7 Days
                </p>
                <Line data={salesPurchasesData} />
              </div>

              <div
                className="bg-white p-6 rounded-lg shadow-md flex-1"
                style={{ maxWidth: "400px" }}
              >
                <p className="text-xl text-gray-700 mb-4">
                  Overview of August, 2021
                </p>
                <Pie data={overviewData} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col space-y-6">
            <Skeleton height={40} width={`100%`} />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <Skeleton height={40} width={`60%`} />
                <Skeleton height={20} width={`80%`} />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <Skeleton height={40} width={`60%`} />
                <Skeleton height={20} width={`80%`} />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <Skeleton height={40} width={`60%`} />
                <Skeleton height={20} width={`80%`} />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <Skeleton height={40} width={`60%`} />
                <Skeleton height={20} width={`80%`} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <div
                className="bg-white p-4 rounded-lg shadow-md flex-1"
                style={{ maxWidth: "800px" }}
              >
                <Skeleton height={30} width={`80%`} className="mb-4" />{" "}
                <Skeleton height={300} width={`100%`} />{" "}
              </div>

              <div
                className="bg-white p-4 rounded-lg shadow-md flex-1"
                style={{ maxWidth: "400px" }}
              >
                <Skeleton height={30} width={`80%`} className="mb-4" />{" "}
                <Skeleton height={300} width={`100%`} />{" "}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
