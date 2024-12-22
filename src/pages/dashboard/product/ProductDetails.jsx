// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import SideBar from "../../../assets/components/Sidebar";
import Navbar from "../../../assets/components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "@mui/material";
import showToast from "../../../utils/showToast";
import endpoints from "../../../constants/apiEndpoint";
import { Link } from "react-router-dom";

function ProductDetails() {
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    nama_produk: "",
    kode_produk: "",
    kategori_id: "",
    harga_beli: "",
    harga_jual: "",
    stok: "",
    deskripsi: "",
    image: null,
    id: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const lastInteraction = localStorage.getItem("last_interaction");
    const startTime = Date.now();
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
      if (!id) {
        console.error("Category ID is undefined");
        return;
      }

      const fetchProduct = async () => {
        if (token) {
          try {
            const response = await fetch(`${endpoints.product}/${id}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            if (!response.ok) {
              throw new Error("Failed to fetch category data");
            }

            const data = await response.json();
            setFormData((prev) => ({
              ...prev,
              ...data.data,
            }));

            const completeImageUrl = data.data.foto;
            setImageUrl(completeImageUrl);
          } catch (error) {
            console.error("Error fetching category data:", error);
            showToast("Failed to fetch product data.", "error");
            navigate("/");
          } finally {
            const endTime = Date.now();
            const fetchDuration = endTime - startTime;
            setTimeout(() => setIsLoading(false), fetchDuration);
          }
        }
      };

      fetchProduct();
    }
  }, [id, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${endpoints.category}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          setCategories(result.data.data);
        } else {
          showToast(result.message || "Failed to load categories.", "error");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        showToast("An error occurred while fetching categories.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col md:flex-row overflow-x-hidden">
      <SideBar />
      <div className="flex-1 bg-gray-100 p-4 sm:p-6">
        <Navbar />
        <div className="container mx-auto p-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton variant="text" height={90} />
                  <Skeleton variant="text" height={90} />
                  <Skeleton variant="text" height={90} />
                  <Skeleton variant="text" height={90} />
                  <Skeleton variant="text" height={90} />
                  <Skeleton variant="text" height={90} />
                </div>
                <Skeleton variant="text" height={90} className="mt-4" />
                <Skeleton variant="rectangular" height={200} className="mt-4" />
                <Skeleton variant="rectangular" height={50} className="mt-4" />
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text">
                        Product Name <span className="text-red-600">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter product name"
                      name="nama_produk"
                      value={formData.nama_produk}
                      className="input input-bordered w-full"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">
                        Code <span className="text-red-600">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter product code"
                      name="kode_produk"
                      value={formData.kode_produk}
                      className="input input-bordered w-full"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">
                        Category <span className="text-red-600">*</span>
                      </span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        className="select select-bordered w-full"
                        defaultValue={formData.kategori_id || ""}
                        name="kategori_id"
                        disabled
                      >
                        <option disabled value="">
                          Select Category
                        </option>
                        {categories.length > 0 ? (
                          categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.nama_kategori}
                            </option>
                          ))
                        ) : (
                          <option>No categories available</option>
                        )}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">
                        Cost <span className="text-red-600">*</span>
                      </span>
                    </label>
                    <input
                      type="number"
                      placeholder="Enter cost"
                      name="harga_beli"
                      value={formData.harga_beli}
                      className="input input-bordered w-full"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">
                        Price <span className="text-red-600">*</span>
                      </span>
                    </label>
                    <input
                      type="number"
                      placeholder="Enter price"
                      name="harga_jual"
                      value={formData.harga_jual}
                      className="input input-bordered w-full"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">
                        Quantity <span className="text-red-600">*</span>
                      </span>
                    </label>
                    <input
                      type="number"
                      placeholder="Enter quantity"
                      name="stok"
                      value={formData.stok}
                      className="input input-bordered w-full"
                      readOnly
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    placeholder="Add a description..."
                    name="deskripsi"
                    value={formData.deskripsi}
                    className="textarea textarea-bordered w-full"
                    readOnly
                  ></textarea>
                </div>

                <div className="mt-6">
                  <label className="label">
                    <span className="label-text">
                      Product Images <span className="text-red-600">*</span>
                    </span>
                  </label>
                  <div>
                    <div className="cursor-pointer border-dashed border-2 border-gray-300 rounded-lg h-52 flex items-center justify-center bg-blue-50 overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={formData.nama_produk}
                          className="max-w-full max-h-full object-contain"
                          aria-readonly
                        />
                      ) : (
                        <div className="text-center">
                          <svg
                            className="w-12 h-12 text-blue-400 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4v16m8-8H4"
                            ></path>
                          </svg>
                          <p className="text-gray-500 text-sm mt-2">
                            Upload Image
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      accept="image/*"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    to="/dashboard/products"
                    className="btn bg-gray-200 text-gray-800 w-full"
                  >
                    Back
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
