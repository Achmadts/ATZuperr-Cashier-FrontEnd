import { useState, useEffect } from "react";
import SideBar from "../../../assets/components/Sidebar";
import Navbar from "../../../assets/components/Navbar";
import endpoints from "../../../constants/apiEndpoint";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";
import showToast from "../../../utils/showToast";

const CategoryAdd = () => {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryData, setCategoryData] = useState({
    nama_kategori: "",
    kode_kategori: "",
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
        setLoading(false);
      }, 1000);
    }
  }, [navigate]);

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("access_token");

    if (
      !categoryData.nama_kategori ||
      categoryData.nama_kategori.trim() === ""
    ) {
      showToast("Category name is required", "error");
      setIsSubmitting(false);
      return;
    }

    if (
      !categoryData.kode_kategori ||
      categoryData.kode_kategori.trim() === ""
    ) {
      showToast("Category code is required", "error");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("nama_kategori", categoryData.nama_kategori);
    formData.append("kode_kategori", categoryData.kode_kategori);

    try {
      const response = await fetch(`${endpoints.category}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success === false) {
        if (result.data) {
          Object.keys(result.data).forEach((field) => {
            result.data[field].forEach((error) => {
              showToast(error, "error");
            });
          });
        } else {
          showToast(result.message || "Failed to add category", "error");
        }
      } else {
        showToast("Category Added Successfully!", "success");
        navigate("/dashboard/categories");
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      showToast("Failed to add category!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <SideBar />
      <div className="flex-grow p-6">
        <Navbar />
        <div className="flex justify-center items-center">
          <div className="card bg-white shadow-lg w-full max-w-lg">
            <div className="card-body p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-700">
                Add Category
              </h2>
              {loading ? (
                <div
                  className="w-full"
                  style={{ minHeight: "240px" }}
                >
                  <div className="form-group mb-6">
                    <Skeleton
                      variant="text"
                      sx={{
                        fontSize: "1rem",
                        width: "40%",
                        marginBottom: "0.5rem",
                        backgroundColor: "#e0e0e0",
                      }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={40}
                      sx={{
                        backgroundColor: "#e0e0e0",
                        borderRadius: "4px",
                        marginBottom: "1rem",
                      }}
                    />
                  </div>

                  <div className="form-group mb-6">
                    <Skeleton
                      variant="text"
                      sx={{
                        fontSize: "1rem",
                        width: "40%",
                        marginBottom: "0.5rem",
                        backgroundColor: "#e0e0e0",
                      }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={40}
                      sx={{
                        backgroundColor: "#e0e0e0",
                        borderRadius: "4px",
                        marginBottom: "1rem",
                      }}
                    />
                  </div>

                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={48}
                    sx={{
                      backgroundColor: "#e0e0e0",
                      borderRadius: "4px",
                      marginTop: "20px",
                    }}
                  />
                </div>
              ) : (
                <form onSubmit={handleCategorySubmit}>
                  <div className="form-group mb-4">
                    <label className="block text-gray-600 mb-2">
                      Category Code <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={categoryData.kode_kategori || ""}
                      onChange={(e) =>
                        setCategoryData({
                          ...categoryData,
                          kode_kategori: e.target.value,
                        })
                      }
                      className="input input-bordered w-full border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label className="block text-gray-600 mb-2">
                      Category Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={categoryData.nama_kategori || ""}
                      onChange={(e) =>
                        setCategoryData({
                          ...categoryData,
                          nama_kategori: e.target.value,
                        })
                      }
                      className="input input-bordered w-full border-gray-300 rounded"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Memproses..." : "Add Category"}{" "}
                    <i className="ml-2 bi bi-check"></i>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryAdd;
