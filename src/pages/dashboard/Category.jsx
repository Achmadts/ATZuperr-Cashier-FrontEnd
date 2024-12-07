// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import Sidebar from "../../assets/components/Sidebar";
import Navbar from "../../assets/components/Navbar";
import endpoints from "../../constants/apiEndpoint";
import { toast } from "react-toastify";
import Modal from "react-modal";
import FilterSection from "../../assets/components/partials/FilterSection";
import Pagination from "../../assets/components/partials/Pagination";
import { useNavigate } from "react-router-dom";

import {
  DescriptionOutlined,
  Print,
  Replay,
  ModeEditOutlineRounded,
  DeleteOutlined,
  ArrowDropDownOutlined,
  ArrowDropUpOutlined,
} from "@mui/icons-material";

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // const [selectedAction] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const lastInteraction = localStorage.getItem("last_interaction");
    const currentTime = new Date().getTime();
    const interactionTime = parseInt(lastInteraction, 10);

    if (!token || !lastInteraction) {
      navigate("/");
      return;
    }

    if (currentTime - interactionTime > 60 * 60 * 1000) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("last_interaction");
      navigate("/");
    } else {
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
          } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Failed to fetch user data.");
            navigate("/");
          }
        }
      };
      fetchUserData();
    }
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(endpoints.category, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories.");
      }

      const result = await response.json();
      if (Array.isArray(result.data)) {
        setCategories(result.data);
      } else {
        console.error("Data fetched is not an array:", result.data);
        setCategories([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleReload = () => {
    setLoading(true);
    fetchCategories();
  };

  const toggleDropdown = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="flex flex-col md:flex-row overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-4 sm:p-6">
        <Navbar />
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <button className="btn btn-primary text-white">
              Add Category +
            </button>
            <div className="flex space-x-2">
              <div className="hidden md:flex space-x-2">
                <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300">
                  <DescriptionOutlined className="mr-2" />
                  Excel
                </button>
                <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300">
                  <Print className="mr-2" />
                  Print
                </button>
                <button
                  className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300"
                  onClick={handleReload}
                >
                  <Replay className="mr-2" />
                  Reload
                </button>
              </div>

              <div className="md:hidden relative">
                <button
                  className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300"
                  onClick={() => toggleDropdown("mobile")}
                >
                  More
                  {openDropdown === "mobile" ? (
                    <ArrowDropUpOutlined className="mr-2" />
                  ) : (
                    <ArrowDropDownOutlined className="mr-2" />
                  )}
                </button>
                {openDropdown === "mobile" && (
                  <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg w-[150px] z-50">
                    <button
                      className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                      // onClick={() => alert("Excel clicked")}
                    >
                      Excel
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                      // onClick={() => alert("Print clicked")}
                    >
                      Print
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                      // onClick={() => alert("Reload clicked")}
                    >
                      Reload
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <hr className="border-t border-gray-300 mb-4" />
          <FilterSection />
          <div className="overflow-x-auto">
            <table className="table w-full border border-gray-300 border-collapse">
              <thead>
                <tr className="bg-gray-200 text-center text-sm">
                  <th className="border border-gray-300 px-4 py-2">
                    Category Code
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Category Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="border border-gray-300 px-4 py-2">
                      {category.kode_kategori}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {category.nama_kategori}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="md:hidden">
                        <button
                          className="btn btn-sm btn-primary text-white flex items-center justify-center px-2 py-1"
                          onClick={() => setOpenModal(true)}
                        >
                          Action
                        </button>
                      </div>

                      <Modal
                        isOpen={openModal}
                        onRequestClose={closeModal}
                        contentLabel="Action Modal"
                        className="bg-white p-4 rounded-md shadow-md w-[300px] mx-auto"
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                      >
                        <h2 className="text-lg mb-4">Choose Action</h2>
                        <div className="flex flex-col space-y-2">
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              // alert(`${selectedAction}: Edit clicked`);
                              closeModal();
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-error"
                            onClick={() => {
                              // alert(`${selectedAction}: Delete clicked`);
                              closeModal();
                            }}
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-accent mt-4"
                            onClick={closeModal}
                          >
                            Cancel
                          </button>
                        </div>
                      </Modal>
                      <div className="hidden md:flex space-x-1 justify-center items-center">
                        <button className="btn btn-sm btn-primary text-white flex items-center justify-center px-2 py-1 group">
                          Edit
                          <ModeEditOutlineRounded className="group-hover:text-white transition duration-300" />
                        </button>
                        <button className="btn btn-sm btn-error text-white flex items-center justify-center px-2 py-1 group">
                          Delete
                          <DeleteOutlined className="group-hover:text-white transition duration-300" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination />
        </div>
        <footer className="mt-8 text-center text-sm text-gray-500">
          ATZuperrr Cashier © 2024 || Developed by{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Achmad Tirto Sudiro
          </a>
        </footer>
      </div>
    </div>
  );
};

export default CategoryTable;
