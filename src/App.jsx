import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import Login from "./pages/Login";
import UpdateProfileAndPassword from "./pages/dashboard/UpdateProfile";
import Category from "./pages/dashboard/Category";
import { SidebarProvider } from "./context/SidebarContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <SidebarProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard/*"
            element={
              <Routes>
                <Route path="home" element={<Home />} />
                <Route path="categories" element={<Category />} />
                <Route
                  path="profile-password/:id"
                  element={<UpdateProfileAndPassword />}
                />
              </Routes>
            }
          />
        </Routes>
        <ToastContainer />
      </Router>
    </SidebarProvider>
  );
}

export default App;
