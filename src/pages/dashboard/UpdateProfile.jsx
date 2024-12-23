import { useState, useEffect } from "react";
import SideBar from "../../assets/components/Sidebar";
import Navbar from "../../assets/components/Navbar";
import endpoints from "../../constants/apiEndpoint";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "@mui/material";
import showToast from "../../utils/showToast";
import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";

const UpdateProfileAndPassword = () => {
  const [images, setImages] = useState(null);
  const [imagesFromDb, setImagesFromDb] = useState(null);
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingPW, setIsSubmittingPW] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("Loading...");
  const [email, setEmail] = useState("Loading...");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState({
    password: false,
  });

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

            if (data) {
              setName(data.user.name || null);
              setEmail(data.user.email || "email@example.com");
              setImagesFromDb(data.user.images || null);
              setImages(null);
            } else {
              console.error("Invalid user data");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            showToast("Failed to fetch user data.", "error");
            navigate("/");
          } finally {
            const endTime = Date.now();
            const fetchDuration = endTime - startTime;
            setTimeout(() => setLoading(false), fetchDuration);
          }
        }
      };
      fetchUserData();
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImages(file);
    } else {
      setImages(null);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("access_token");

    if (!name || name.trim() === "") {
      showToast("Name is required", "error");
      return;
    }
    if (!email || email.trim() === "") {
      showToast("Email is required", "error");
      return;
    }

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", name);
    formData.append("email", email);

    if (images && images instanceof File) {
      formData.append("images", images);
    }

    try {
      const response = await fetch(`${endpoints.updateProfile}/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        showToast("Failed to update profile", "error");
      } else {
        showToast("Profile Updated Successfully!", "success");
      }

      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      showToast("Data gagal diupdate!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingPW(true);

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match!", "error");
      setIsSubmittingPW(false);
      return;
    }

    const token = localStorage.getItem("access_token");

    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("currentPassword", currentPassword);
      formData.append("password", newPassword);

      const response = await fetch(`${endpoints.updateProfile}/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData?.data?.currentPassword) {
          alert(errorData.data.currentPassword[0]);
        } else if (errorData?.data?.password) {
          alert(errorData.data.password[0]);
        } else {
          showToast("Failed to update password", "error");
        }
        return;
      }

      showToast("Password Updated Successfully!", "success");
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      showToast("Failed to update password!", "error");
    } finally {
      setIsSubmittingPW(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };
  return (
    <div className="flex bg-gray-100">
      <SideBar />

      <div className="flex-grow p-6">
        <Navbar />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card bg-white shadow-lg">
            <div className="card-body p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-700">
                Update Profile
              </h2>
              {loading ? (
                <div style={{ minHeight: "450px", paddingTop: "20px" }}>
                  <div className="flex justify-center mb-6">
                    <Skeleton
                      variant="circular"
                      width={96}
                      height={96}
                      sx={{ backgroundColor: "#e0e0e0" }}
                    />
                  </div>

                  <div className="form-group mb-6">
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={48}
                      sx={{ backgroundColor: "#f0f0f0", borderRadius: "4px" }}
                    />
                  </div>

                  <div className="form-group mb-6">
                    <Skeleton
                      variant="text"
                      sx={{
                        fontSize: "1rem",
                        width: "40%",
                        marginBottom: "0.5rem",
                      }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={48}
                      sx={{ backgroundColor: "#f0f0f0", borderRadius: "4px" }}
                    />
                  </div>

                  <div className="form-group mb-6">
                    <Skeleton
                      variant="text"
                      sx={{
                        fontSize: "1rem",
                        width: "40%",
                        marginBottom: "0.5rem",
                      }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={48}
                      sx={{ backgroundColor: "#f0f0f0", borderRadius: "4px" }}
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
                <form onSubmit={handleProfileSubmit}>
                  <div className="form-group mb-4">
                    <label className="block text-gray-600 mb-2">
                      Profile Image
                    </label>
                    <div className="flex justify-center mb-4">
                      {images ? (
                        <img
                          src={URL.createObjectURL(images)}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover shadow-lg"
                        />
                      ) : imagesFromDb ? (
                        <img
                          src={`http://localhost:8000/storage/${imagesFromDb}`}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover shadow-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-lg text-center">
                            {name}
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="file-input block w-full border-gray-300 rounded"
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label className="block text-gray-600 mb-2">
                      Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input input-bordered w-full border-gray-300 rounded"
                      required
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label className="block text-gray-600 mb-2">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input input-bordered w-full border-gray-300 rounded"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className={`btn btn-primary w-full bg-blue-600 text-white rounded disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Memproses..." : "Update Profile"}
                  </button>
                </form>
              )}
            </div>
          </div>
          <div className="card bg-white shadow-lg">
            <div className="card-body p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-700">
                Update Password
              </h2>
              {loading ? (
                <div style={{ minHeight: "450px", paddingTop: "20px" }}>
                  <div className="form-group mb-6">
                    <Skeleton
                      variant="text"
                      sx={{
                        fontSize: "1rem",
                        width: "40%",
                        marginBottom: "0.5rem",
                      }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={40}
                      sx={{ backgroundColor: "#f0f0f0", borderRadius: "4px" }}
                    />
                  </div>

                  <div className="form-group mb-6">
                    <Skeleton
                      variant="text"
                      sx={{
                        fontSize: "1rem",
                        width: "40%",
                        marginBottom: "0.5rem",
                      }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={40}
                      sx={{ backgroundColor: "#f0f0f0", borderRadius: "4px" }}
                    />
                  </div>

                  <div className="form-group mb-6">
                    <Skeleton
                      variant="text"
                      sx={{
                        fontSize: "1rem",
                        width: "40%",
                        marginBottom: "0.5rem",
                      }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={40}
                      sx={{ backgroundColor: "#f0f0f0", borderRadius: "4px" }}
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
                <form onSubmit={handlePasswordSubmit}>
                  <div className="form-group mb-4">
                    <label className="block text-gray-600 mb-2">
                      Current Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type={showPassword.password ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="input input-bordered w-full border-gray-300 rounded"
                      required
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label className="block text-gray-600 mb-2">
                      New Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type={showPassword.password ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input input-bordered w-full border-gray-300 rounded"
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label className="block text-gray-600 mb-2">
                      Confirm Password <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.password ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input input-bordered w-full border-gray-300 rounded"
                        required
                        minLength={6}
                      />
                      <span
                        onClick={() => togglePasswordVisibility("password")}
                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                      >
                        {showPassword.password ? (
                          <VisibilityOutlined />
                        ) : (
                          <VisibilityOffOutlined />
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`btn btn-primary w-full bg-blue-600 text-white rounded disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed ${
                      isSubmittingPW ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isSubmittingPW}
                  >
                    {isSubmittingPW ? "Memproses..." : "Update Password"}
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

export default UpdateProfileAndPassword;
