import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Home from "./pages/dashboard/Home";

import UpdateProfileAndPassword from "./pages/dashboard/UpdateProfile";

import Category from "./pages/dashboard/category/Category";
import CategoryEdit from "./pages/dashboard/category/CategoryEdit";
import CategoryAdd from "./pages/dashboard/category/CategoryAdd";


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
                <Route path="categories/edit/:id" element={<CategoryEdit />} />
                <Route path="categories/add" element={<CategoryAdd />} />
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
