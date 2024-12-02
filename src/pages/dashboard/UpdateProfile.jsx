import { useState, useEffect } from "react";
import SideBar from "../../assets/components/Sidebar";
import Navbar from "../../assets/components/Navbar";
import endpoints from "../../constants/apiEndpoint";

const UpdateProfileAndPassword = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("Loading...");
  const [email, setEmail] = useState("Loading...");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [setLoading] = useState(true);

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
            throw new Error("Failed to fetch user data");
          }

          const data = await response.json();

          if (data) {
            setName(data.user.name || null);
            setEmail(data.user.email || "email@example.com");
            setImage(data.user.image || null);
          } else {
            console.error("Invalid user data");
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [setLoading]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(endpoints.user, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          image,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      alert("Profile Updated Successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
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

      alert("Password Updated Successfully!");
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
              <form onSubmit={handleProfileSubmit}>
                <div className="form-group mb-4">
                  <label className="block text-gray-600 mb-2">
                    Profile Image *
                  </label>
                  <div className="flex justify-center mb-4">
                    {image ? (
                      <img
                        src={image}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-lg">No Image</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="file-input block w-full border border-gray-300 rounded"
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="block text-gray-600 mb-2">Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input input-bordered w-full border-gray-300 rounded"
                    required
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="block text-gray-600 mb-2">Email *</label>
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
            </div>
          </div>

          <div className="card bg-white shadow-lg">
            <div className="card-body p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-700">
                Update Password
              </h2>
              <form onSubmit={handlePasswordSubmit}>
                <div className="form-group mb-4">
                  <label className="block text-gray-600 mb-2">
                    Current Password *
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
                    New Password *
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input input-bordered w-full border-gray-300 rounded"
                    required
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="block text-gray-600 mb-2">
                    Confirm Password *
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileAndPassword;
