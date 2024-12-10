import { useState, useEffect } from "react";
import SideBar from "../../../assets/components/Sidebar";
import Navbar from "../../../assets/components/Navbar";
import endpoints from "../../../constants/apiEndpoint";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "@mui/material";
import showToast from "../../../utils/showToast";

const CategoryEdit = () => {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryData, setCategoryData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

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

      const fetchCategoryData = async () => {
        if (token) {
          try {
            const response = await fetch(`${endpoints.category}/${id}`, {
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
            setCategoryData(data.data);
          } catch (error) {
            console.error("Error fetching category data:", error);
            showToast("Failed to fetch category data.", "error");
            navigate("/");
          } finally {
            const endTime = Date.now();
            const fetchDuration = endTime - startTime;
            setTimeout(() => setLoading(false), fetchDuration);
          }
        }
      };
      fetchCategoryData();
    }
  }, [id, navigate]);

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
    formData.append("_method", "PUT");
    formData.append("nama_kategori", categoryData.nama_kategori);
    formData.append("kode_kategori", categoryData.kode_kategori);

    try {
      const response = await fetch(`${endpoints.category}/${categoryData.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        showToast("Failed to update category", "error");
      } else {
        showToast("Category Updated Successfully!", "success");
        navigate("/dashboard/categories");
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      showToast("Failed to update category!", "error");
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
                Edit Category
              </h2>
              {loading ? (
                <div
                  className="w-full"
                  style={{ minHeight: "240px", backgroundColor: "#f0f0f0" }}
                >
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    sx={{ backgroundColor: "#e0e0e0" }}
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
                      value={categoryData?.kode_kategori || ""}
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
                      value={categoryData?.nama_kategori || ""}
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
                    {isSubmitting ? "Memproses..." : "Update Category"}{" "}
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

export default CategoryEdit;
