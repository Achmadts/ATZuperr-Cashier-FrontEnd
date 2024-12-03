import { useState, useEffect } from "react";
import SideBar from "../../assets/components/Sidebar";
import Navbar from "../../assets/components/Navbar";
import endpoints from "../../constants/apiEndpoint";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Skeleton } from "@mui/material";

const UpdateProfileAndPassword = () => {
  const [images, setImages] = useState(null);
  const [imagesFromDb, setImagesFromDb] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("Loading...");
  const [email, setEmail] = useState("Loading...");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const lastInteraction = localStorage.getItem("last_interaction");
    const startTime = Date.now();
    const currentTime = new Date().getTime();
    const interactionTime = parseInt(lastInteraction, 10);

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
            toast.error("Failed to fetch user data.");
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
    const token = localStorage.getItem("access_token");

    if (!name || name.trim() === "") {
      alert("Name is required");
      return;
    }
    if (!email || email.trim() === "") {
      alert("Email is required");
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
        throw new Error("Failed to update profile");
      }

      alert("Profile Updated Successfully!");
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("An error occurred while updating your profile.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(endpoints.changePassword, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      alert(" Password Updated Successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
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
                <div style={{ minHeight: "450px" }}>
                  <Skeleton variant="rectangular" width="100%" height="100%" />
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
                      ) : (
                        imagesFromDb ? (
                          <img
                            src={`http://localhost:8000/storage/${imagesFromDb}`}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover shadow-lg"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 text-lg">
                              No Image
                            </span>
                          </div>
                        )
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
                    className="btn btn-primary w-full bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Update Profile <i className="ml-2 bi bi-check"></i>
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
                <div style={{ minHeight: "450px" }}>
                  <Skeleton variant="rectangular" width="100%" height="100%" />
                </div>
              ) : (
                <form onSubmit={handlePasswordSubmit}>
                  <div className="form-group mb-4">
                    <label className="block text-gray-600 mb-2">
                      Current Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
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
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input input-bordered ```javascript
                      w-full border-gray-300 rounded"
                      required
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label className="block text-gray-600 mb-2">
                      Confirm Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input input-bordered w-full border-gray-300 rounded"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Update Password <i className="ml-2 bi bi-check"></i>
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