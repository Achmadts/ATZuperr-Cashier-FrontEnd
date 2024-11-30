// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import endpoints from "../constants/apiEndpoint";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const lastInteraction = localStorage.getItem("last_interaction");

    if (token && lastInteraction) {
      const currentTime = new Date().getTime();
      const interactionTime = parseInt(lastInteraction, 10);

      if (currentTime - interactionTime <= 30 * 24 * 60 * 60 * 1000) {
        navigate("/dashboard/home");
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("last_interaction");
        navigate("/");
      }
    }
  }, [navigate]);

  useEffect(() => {
    const updateLastInteraction = () => {
      localStorage.setItem("last_interaction", new Date().getTime().toString());
    };

    window.addEventListener("click", updateLastInteraction);
    window.addEventListener("keydown", updateLastInteraction);

    return () => {
      window.removeEventListener("click", updateLastInteraction);
      window.removeEventListener("keydown", updateLastInteraction);
    };
  }, []);

  const validateInputs = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email tidak boleh kosong.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email tidak valid.";
    }
    if (!password.trim()) {
      newErrors.password = "Password tidak boleh kosong.";
    } else if (password.length < 6) {
      newErrors.password = "Password harus minimal 6 karakter.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateInputs();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(endpoints.authenticate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.token);
        localStorage.setItem(
          "last_interaction",
          new Date().getTime().toString()
        );
        setIsLoading(false);
        navigate("/dashboard/home");
      } else {
        const errorData = await response.json();
        setErrors({
          form:
            errorData.message ||
            "Login gagal, periksa kembali kredensial Anda.",
        });
        setIsLoading(false);
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setIsLoading(false);
      setErrors({ form: "Terjadi kesalahan, coba lagi nanti." });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-800">ATZuperr Cashier</h1>
          <p className="text-gray-600">Sign In to your account</p>
        </div>

        {errors.form && (
          <div className="text-red-500 text-sm mb-4">{errors.form}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Email
            </label>
            <div className="relative mt-1">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={`w-full px-4 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring focus:ring-blue-300`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`w-full px-4 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring focus:ring-blue-300`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className={`w-full px-4 py-2 text-slate-100 font-semibold rounded-lg flex items-center justify-center ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-slate-700 hover:bg-blue-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Loading...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Developed By{" "}
          <span className="text-blue-600 font-bold">Achmad Tirto Sudiro</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
