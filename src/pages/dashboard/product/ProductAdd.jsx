// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import SideBar from "../../../assets/components/Sidebar";
import Navbar from "../../../assets/components/Navbar";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";
import showToast from "../../../utils/showToast";
import endpoints from "../../../constants/apiEndpoint";

function CreateProduct() {
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
    foto: null,
  });
  const navigate = useNavigate();

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
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [navigate]);

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

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setFormData({
        ...formData,
        image: file,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nama_produk ||
      !formData.kode_produk ||
      !formData.kategori_id ||
      !formData.harga_beli ||
      !formData.harga_jual ||
      !formData.stok ||
      !formData.image 
    ) {
      showToast("Please fill in all required fields. (*)", "error");
      return;
    }

    const form = new FormData();
    form.append("nama_produk", formData.nama_produk);
    form.append("kode_produk", formData.kode_produk);
    form.append("kategori_id", formData.kategori_id);
    form.append("harga_beli", formData.harga_beli);
    form.append("harga_jual", formData.harga_jual);
    form.append("stok", formData.stok);
    form.append("deskripsi", formData.deskripsi);

    if (formData.image) {
      form.append("foto", formData.image);
    }

    try {
      const response = await fetch(endpoints.product, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: form,
      });

      const result = await response.json();

      if (response.ok) {
        showToast("Product created successfully!", "success");
        navigate("/dashboard/products");
      } else {
        showToast(result.message || "Failed to create product.", "error");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      showToast("An error occurred. Please try again.", "error");
    }
  };

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
              <form onSubmit={handleSubmit}>
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
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
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
                      value={formData.code}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
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
                        value={formData.category}
                        onChange={handleInputChange}
                        name="kategori_id"
                      >
                        <option disabled>Select Category</option>
                        {categories.length > 0 ? (
                          categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.nama_kategori}{" "}
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
                      value={formData.cost}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
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
                      value={formData.price}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
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
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
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
                    value={formData.description}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered w-full"
                  ></textarea>
                </div>

                <div className="mt-6">
                  <label className="label">
                    <span className="label-text">
                      Product Images <span className="text-red-600">*</span>
                    </span>
                  </label>
                  <div>
                    <div
                      onClick={handleClick}
                      className="cursor-pointer border-dashed border-2 border-gray-300 rounded-lg h-52 flex items-center justify-center bg-blue-50 overflow-hidden"
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="Uploaded"
                          className="max-w-full max-h-full object-contain"
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
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="btn btn-primary text-white w-full"
                  >
                    Create Product
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
