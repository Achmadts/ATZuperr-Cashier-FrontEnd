import { useEffect, useState } from "react";
import {
  HomeIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import endpoints from "../../constants/apiEndpoint";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Sidebar() {
  const [isAdmin, setIsAdmin] = useState(null);
  const navigate = useNavigate();

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
            throw new Error("Gagal mengambil data user");
          }

          const data = await response.json();

          if (data && data.user && typeof data.user.is_admin !== "undefined") {
            setIsAdmin(data.user.is_admin);
          } else {
            console.error("Data user tidak valid");
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogoutClick = () => {
    document.getElementById("logout_modal").showModal();
  };

  const confirmLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const cancelLogout = () => {
    document.getElementById("logout_modal").close();
  };

  if (isAdmin === null) {
    return (
      <div className="flex-col w-64 bg-slate-700 text-slate-950 h-screen p-4 sm:block hidden">
        <div className="flex items-center space-x-2 text-lg font-bold">
          <div className="bg-blue-500 p-2 rounded-full flex items-center justify-center">
            <Skeleton width={30} height={30} />
          </div>
          <Skeleton width={100} height={20} />
        </div>
        <nav className="mt-10 space-y-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 text-slate-950 hover:text-gray-400"
            >
              <Skeleton width={20} height={20} />
              <Skeleton width={100} height={20} />
            </div>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div className="w-64 bg-slate-700 text-white h-screen p-4 sm:block hidden">
      <div className="flex items-center space-x-2 text-lg font-bold">
        <a
          href="#"
          className="flex items-center text-white hover:text-gray-400"
        >
          <div className="bg-blue-500 p-2 rounded-full flex items-center justify-center">
            📦
          </div>
          <span className="ml-2">ATZuperrr Cashier</span>
        </a>
      </div>
      <nav className="mt-10 space-y-4">
        <a
          href="#"
          className="flex items-center space-x-2 text-white hover:text-gray-400"
        >
          <HomeIcon className="h-5 w-5" />
          <span>Home</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 text-white hover:text-gray-400"
        >
          <ShoppingCartIcon className="h-5 w-5" />
          <span>Products</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 text-white hover:text-gray-400"
        >
          <CurrencyDollarIcon className="h-5 w-5" />
          <span>Purchases</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 text-white hover:text-gray-400"
        >
          <ChartBarIcon className="h-5 w-5" />
          <span>Sales</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 text-white hover:text-gray-400"
        >
          <CurrencyDollarIcon className="h-5 w-5" />
          <span>Expenses</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 text-white hover:text-gray-400"
        >
          <CogIcon className="h-5 w-5" />
          <span>Settings</span>
        </a>
        <button
          onClick={handleLogoutClick}
          className="flex items-center space-x-2 text-left hover:text-gray-400"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </nav>

      <dialog id="logout_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box rounded-lg shadow-lg bg-white p-6">
          <h3 className="font-bold text-lg text-gray-800">Konfirmasi Logout</h3>
          <p className="py-4 text-gray-600">Apakah Anda yakin ingin logout?</p>
          <div className="modal-action flex justify-end space-x-2">
            <button
              onClick={confirmLogout}
              className="btn bg-red-600 text-white hover:bg-red-700 transition duration-200 ease-in-out rounded-md px-4 py-2"
            >
              Ya
            </button>
            <button
              onClick={cancelLogout}
              className="btn bg-gray-300 text-gray-800 hover:bg-gray-400 transition duration-200 ease-in-out rounded-md px-4 py-2"
            >
              Batal
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default Sidebar;
