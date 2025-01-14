// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import Sidebar from "../../../assets/components/Sidebar";
import Navbar from "../../../assets/components/Navbar";
import endpoints from "../../../constants/apiEndpoint";
import Modal from "react-modal";
Modal.setAppElement("#root");
import showToast from "../../../utils/showToast";
import Pagination from "../../../assets/components/partials/Pagination";
import { useNavigate } from "react-router-dom";
import { Skeleton, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import {
  DescriptionOutlined,
  Replay,
  ModeEditOutlineRounded,
  DeleteOutlined,
  ArrowDropDownOutlined,
  // FilterAltOutlined,
  ArrowDropUpOutlined,
  InfoOutlined,
  CheckCircleOutlined,
  RunningWithErrorsOutlined,
  // CancelOutlined,
} from "@mui/icons-material";

const SalesTable = () => {
  const [sales, setSales] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [selectedSale, setSelectedSale] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showEntries, setShowEntries] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchTerm]);

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
            // eslint-disable-next-line no-unused-vars
          } catch (error) {
            showToast("Gagal mendapatkan data user.", "error");
            navigate("/");
          }
        }
      };
      fetchUserData();
    }
  }, [navigate, currentPage, showEntries]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${endpoints.sale}?page=${currentPage}&per_page=${showEntries}&searchTerm=${searchTerm}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sales.");
      }

      const result = await response.json();

      if (result.success && Array.isArray(result.data.data)) {
        setSales(result.data.data);
        setTotalPages(result.data.meta.last_page || 1);
      } else {
        console.error("Data fetched is not an array:", result.data);
        setSales([]);
      }
    } catch (error) {
      console.error(error);
      showToast("Gagal mengambil data Penjualan.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, showEntries, debouncedSearchTerm]);

  const handleDeleteSale = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${endpoints.sale}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus penjualan.");
      }

      showToast("Penjualan berhasil dihapus.", "success");
      fetchSales();
    } catch (error) {
      console.error(error);
      showToast("Terjadi kesalahan saat menghapus data penjualan.", "error");
    }
  };

  const handleDownloadExcel = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Anda belum login! Silakan login terlebih dahulu.");
      return;
    }

    try {
      const response = await fetch(endpoints.saleExport, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          "Failed to download file. Please check your authentication."
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "sales.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Gagal mengunduh file. Silakan coba lagi.");
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case "Completed":
        return (
          <span
            style={{
              color: colors.greenAccent[500],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 1,
            }}
          >
            <CheckCircleOutlined style={{ marginRight: 4 }} />
            {status}
          </span>
        );
      case "Pending":
        return (
          <span
            style={{
              color: "#868dfb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 1,
            }}
          >
            <RunningWithErrorsOutlined style={{ marginRight: 4 }} />
            {status}
          </span>
        );
      // case "Cancelled":
      //   return (
      //     <span
      //       style={{
      //         color: "#dc2626",
      //         display: "flex",
      //         alignItems: "center",
      //         marginTop: 1,
      //       }}
      //     >
      //       <CancelOutlined style={{ marginRight: 4 }} />
      //       {status}
      //     </span>
      //   );
      default:
        return status;
    }
  };

  const openModalActionDelete = (id) => {
    setSelectedSale(id);
    setOpenModalDelete(true);
  };

  const closeModalDelete = () => {
    setSelectedSale(null);
    setOpenModalDelete(false);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {}, [currentPage]);

  const handleReload = () => {
    setLoading(true);
    fetchSales();
  };

  const toggleDropdown = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const handleEntriesChange = (e) => {
    setShowEntries(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openModalWithSale = (sale) => {
    setSelectedSale(sale);
    setOpenModal(true);
  };

  return (
    <div className="flex flex-col md:flex-row overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-4 sm:p-6">
        <Navbar />
        <div className="bg-white shadow rounded-lg p-6">
          {loading ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <Skeleton
                  variant="rectangular"
                  width={140}
                  height={40}
                  className="btn text-white"
                />
                <div className="flex space-x-2">
                  <div className="hidden md:flex space-x-2">
                    <Skeleton
                      variant="rectangular"
                      width={103}
                      height={40}
                      className="flex items-center px-2 py-2 bg-gray-200 text-gray-800 rounded-lg shadow"
                    />
                    <Skeleton
                      variant="rectangular"
                      width={112}
                      height={40}
                      className="flex items-center px-2 py-2 bg-gray-200 text-gray-800 rounded-lg shadow"
                    />
                    {/* <Skeleton
                      variant="rectangular"
                      width={56}
                      height={40}
                      className="flex items-center px-2 py-2 bg-gray-200 text-gray-800 rounded-lg shadow"
                    /> */}
                  </div>
                  <div className="md:hidden relative">
                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={40}
                      className="flex items-center px-2 py-2 bg-gray-200 text-gray-800 rounded-lg shadow"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <button
                  className="btn btn-primary text-white"
                  onClick={() => {
                    navigate("add");
                  }}
                >
                  Add Sale +
                </button>
                <div className="flex space-x-2">
                  <div className="hidden md:flex space-x-2">
                    <button
                      className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300"
                      onClick={handleDownloadExcel}
                    >
                      <DescriptionOutlined className="mr-2" />
                      Excel
                    </button>
                    <button
                      className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300"
                      onClick={handleReload}
                    >
                      <Replay className="mr-2" />
                      Reload
                    </button>
                    {/* <button
                      className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300"
                      onClick={}
                    >
                      <FilterAltOutlined />
                    </button> */}
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
                          onClick={handleDownloadExcel}
                        >
                          Excel
                        </button>
                        <button
                          onClick={handleReload}
                          className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                        >
                          Reload
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
          <hr className="border-t border-gray-300 mb-4" />
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            {loading ? (
              <div className="w-full md:w-auto mb-2 md:mb-0">
                <Skeleton variant="rectangular" width={180} height={30} />
              </div>
            ) : (
              <div className="w-full md:w-auto mb-2 md:mb-0">
                <span>Show</span>
                <select
                  value={showEntries}
                  onChange={handleEntriesChange}
                  className="mx-2 border border-gray-300 rounded px-2 py-1 focus:ring focus:ring-blue-200"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                entries
              </div>
            )}

            {loading ? (
              <div className="w-full md:w-auto">
                <Skeleton variant="rectangular" width={200} height={30} />
              </div>
            ) : (
              <div className="w-full md:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    id="floating_outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="block px-2.5 pb-2.5 pt-4 w-full md:w-auto text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    autoComplete="off"
                  />
                  <label
                    htmlFor="floating_outlined"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-0 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Search
                  </label>
                </div>
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full border border-gray-300 border-collapse">
              <thead>
                <tr className="bg-gray-200 text-center text-sm">
                  {loading ? (
                    <>
                      <th
                        className="border border-gray-300 px-4 py-2 text-center"
                        style={{ width: "5%" }}
                      >
                        <div className="flex justify-center">
                          <Skeleton
                            variant="rectangular"
                            width="30%"
                            height={20}
                          />
                        </div>
                      </th>
                      <th
                        className="border border-gray-300 px-4 py-2 text-center"
                        style={{ width: "10.71%" }}
                      >
                        <div className="flex justify-center">
                          <Skeleton
                            variant="rectangular"
                            width="30%"
                            height={20}
                          />
                        </div>
                      </th>
                      <th
                        className="border border-gray-300 px-4 py-2 text-center"
                        style={{ width: "10.71%" }}
                      >
                        <div className="flex justify-center">
                          <Skeleton
                            variant="rectangular"
                            width="30%"
                            height={20}
                          />
                        </div>
                      </th>
                      <th
                        className="border border-gray-300 px-4 py-2 text-center"
                        style={{ width: "10.71%" }}
                      >
                        <div className="flex justify-center">
                          <Skeleton
                            variant="rectangular"
                            width="30%"
                            height={20}
                          />
                        </div>
                      </th>
                      <th
                        className="border border-gray-300 px-4 py-2 text-center"
                        style={{ width: "10.71%" }}
                      >
                        <div className="flex justify-center">
                          <Skeleton
                            variant="rectangular"
                            width="20%"
                            height={20}
                          />
                        </div>
                      </th>
                      <th
                        className="border border-gray-300 px-4 py-2 text-center"
                        style={{ width: "10.71%" }}
                      >
                        <div className="flex justify-center">
                          <Skeleton
                            variant="rectangular"
                            width="20%"
                            height={20}
                          />
                        </div>
                      </th>
                      <th
                        className="border border-gray-300 px-4 py-2 text-center"
                        style={{ width: "10.71%" }}
                      >
                        <div className="flex justify-center">
                          <Skeleton
                            variant="rectangular"
                            width="20%"
                            height={20}
                          />
                        </div>
                      </th>
                      <th
                        className="border border-gray-300 px-4 py-2 text-center"
                        style={{ width: "25%" }}
                      >
                        <div className="flex justify-center">
                          <Skeleton
                            variant="rectangular"
                            width="20%"
                            height={20}
                          />
                        </div>
                      </th>
                    </>
                  ) : (
                    <>
                      <th
                        className="border border-gray-300 px-4 py-2"
                        style={{ width: "5%" }}
                      >
                        Product ID
                      </th>
                      <th
                        className="border border-gray-300 px-4 py-2"
                        style={{ width: "10.71%" }}
                      >
                        Product name
                      </th>
                      <th
                        className="border border-gray-300 px-4 py-2"
                        style={{ width: "10.71%" }}
                      >
                        Sale date
                      </th>
                      <th
                        className="border border-gray-300 px-4 py-2"
                        style={{ width: "10.71%" }}
                      >
                        Customer name
                      </th>
                      <th
                        className="border border-gray-300 px-4 py-2"
                        style={{ width: "10.71%" }}
                      >
                        Quantity
                      </th>
                      <th
                        className="border border-gray-300 px-4 py-2"
                        style={{ width: "10.71%" }}
                      >
                        Total price
                      </th>
                      <th
                        className="border border-gray-300 px-4 py-2"
                        style={{ width: "10.71%" }}
                      >
                        Status
                      </th>
                      <th
                        className="border border-gray-300 px-4 py-2"
                        style={{ width: "30.71%" }}
                      >
                        Action
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">
                          <Skeleton variant="text" width="80%" />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <Skeleton variant="text" width="80%" />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <Skeleton variant="text" width="80%" />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <Skeleton variant="text" width="80%" />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <Skeleton variant="text" width="80%" />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <Skeleton variant="text" width="80%" />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <Skeleton variant="text" width="80%" />
                        </td>
                        <td className="border border-gray-300 px-4 py-2 flex justify-center items-center space-x-2">
                          <Skeleton
                            variant="rectangular"
                            width={80}
                            height={30}
                          />
                          <div className="hidden md:flex">
                            <Skeleton
                              variant="rectangular"
                              width={100}
                              height={30}
                            />
                          </div>
                          <div className="hidden md:flex">
                            <Skeleton
                              variant="rectangular"
                              width={80}
                              height={30}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  : sales.map((sale) => (
                      <tr key={sale.id}>
                        <td className="border border-gray-300 px-4 py-2">
                          {sale.detail_penjualans?.length > 1 ? (
                            <div>{sale.detail_penjualans[0].id_produk}...</div>
                          ) : (
                            sale.detail_penjualans?.map((detail) => (
                              <div key={detail.id}>{detail.id_produk}</div>
                            ))
                          )}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {sale.detail_penjualans?.length > 1 ? (
                            <div>
                              {sale.detail_penjualans[0].nama_produk}...
                            </div>
                          ) : (
                            sale.detail_penjualans?.map((detail) => (
                              <div key={detail.id}>{detail.nama_produk}</div>
                            ))
                          )}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {sale.tanggal_penjualan}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {sale.nama_pelanggan}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {sale.quantity}
                        </td>
                        <td>{`Rp. ${new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                          .format(sale.total_harga)
                          .replace("Rp", "")
                          .trim()}`}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {renderStatus(sale.status)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <div className="md:hidden">
                            <button
                              className="btn btn-sm btn-primary text-white flex items-center justify-center px-2 py-1"
                              onClick={() => openModalWithSale(sale)}
                            >
                              Actions
                            </button>
                          </div>
                          <Modal
                            isOpen={openModal}
                            onRequestClose={closeModal}
                            contentLabel="Action Modal"
                            className="bg-white p-4 rounded-md shadow-md w-[300px] mx-auto"
                            overlayClassName="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center"
                          >
                            <h2 className="text-lg mb-4">Choose Action</h2>
                            <div className="flex flex-col space-y-2">
                              <button
                                className="btn btn-primary text-white"
                                onClick={() => {
                                  if (selectedSale) {
                                    navigate(`edit/${selectedSale.id}`);
                                    console.log("ID: " + selectedSale.id);
                                  }
                                  closeModal(true);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn text-white"
                                style={{
                                  backgroundColor: "#868dfb",
                                  borderColor: "#868dfb",
                                }}
                                onClick={() => {
                                  if (selectedSale) {
                                    navigate(`details/${selectedSale.id}`);
                                    console.log("ID: " + selectedSale.id);
                                  }
                                  closeModal(true);
                                }}
                              >
                                Details
                              </button>
                              <button
                                className="btn btn-error"
                                onClick={() => {
                                  if (selectedSale && selectedSale.id) {
                                    handleDeleteSale(selectedSale.id);
                                  } else {
                                    showToast(
                                      "Gagal menghapus. Penjualan tidak valid.",
                                      "error"
                                    );
                                  }
                                  closeModal(true);
                                }}
                              >
                                Delete
                              </button>
                              <button
                                className="btn btn-accent mt-4"
                                onClick={() => closeModal(true)}
                              >
                                Cancel
                              </button>
                            </div>
                          </Modal>
                          <div className="hidden md:flex space-x-1 justify-center items-center">
                            <button
                              className="btn btn-sm btn-primary text-white flex items-center justify-center px-2 py-1 group"
                              onClick={() => navigate(`edit/${sale.id}`)}
                            >
                              Edit
                              <ModeEditOutlineRounded className="group-hover:text-white transition duration-300" />
                            </button>
                            <button
                              className="btn btn-sm text-white flex items-center justify-center px-2 py-1 group"
                              style={{
                                backgroundColor: "#868dfb",
                                border: "none",
                              }}
                              onClick={() => navigate(`details/${sale.id}`)}
                            >
                              Details
                              <InfoOutlined
                                className="group-hover:text-white transition duration-300"
                                style={{
                                  marginLeft: "4px",
                                }}
                              />
                            </button>
                            <button
                              className="btn btn-sm btn-error text-white flex items-center justify-center px-2 py-1 group"
                              onClick={() => openModalActionDelete(sale.id)}
                            >
                              Delete
                              <DeleteOutlined className="group-hover:text-white transition duration-300" />
                            </button>
                          </div>
                          <Modal
                            isOpen={openModalDelete}
                            onRequestClose={closeModalDelete}
                            contentLabel="Delete Confirmation"
                            ariaHideApp={false}
                            className="relative bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto"
                            overlayClassName="fixed inset-0 bg-black bg-opacity-[1%] flex justify-center items-center"
                          >
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                              Are you sure you want to delete this sale?
                            </h2>
                            <div className="flex justify-end space-x-3">
                              <button
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                                onClick={() => {
                                  if (selectedSale) {
                                    handleDeleteSale(selectedSale);
                                  }
                                  closeModalDelete(true);
                                }}
                              >
                                Yes, Delete
                              </button>
                              <button
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200"
                                onClick={() => closeModalDelete(true)}
                              >
                                Cancel
                              </button>
                            </div>
                          </Modal>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        <footer className="mt-8 text-center text-sm text-gray-500">
          ATZuperrr Cashier © 2024 || Developed by
          <a
            href="http://github.com/achmadts"
            className="text-blue-500 hover:underline"
          >
            {" "}
            Achmad Tirto Sudiro
          </a>
        </footer>
      </div>
    </div>
  );
};

export default SalesTable;
