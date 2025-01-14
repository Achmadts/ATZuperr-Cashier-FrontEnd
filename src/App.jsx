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

import Product from "./pages/dashboard/product/Product";
import ProductEdit from "./pages/dashboard/product/ProductEdit";
import ProductAdd from "./pages/dashboard/product/ProductAdd";
import ProductDetails from "./pages/dashboard/product/ProductDetails";

import Sales from "./pages/dashboard/sales/Sales";
import SalesAdd from "./pages/dashboard/sales/SalesAdd";
import SalesEdit from "./pages/dashboard/sales/SalesEdit";
import SalesDetails from "./pages/dashboard/sales/SalesDetails";

import Purchases from "./pages/dashboard/purchases/Purchases";
// import PurchasesAdd from "./pages/dashboard/purchases/PurchasesAdd";
// import PurchasesEdit from "./pages/dashboard/purchases/PurchasesEdit";
// import PurchasesDetails from "./pages/dashboard/purchases/PurchasesDetails";

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

                <Route path="products" element={<Product />} />
                <Route path="products/edit/:id" element={<ProductEdit />} />
                <Route path="products/add" element={<ProductAdd />} />
                <Route
                  path="products/details/:id"
                  element={<ProductDetails />}
                />

                <Route path="sales" element={<Sales />} />
                <Route path="sales/edit/:id" element={<SalesEdit />} />
                <Route path="sales/add" element={<SalesAdd />} />
                <Route path="sales/details/:id" element={<SalesDetails />} />

                <Route path="purchases" element={<Purchases />} />
                {/* <Route path="purchases/edit/:id" element={<PurchasesEdit />} />
                <Route path="purchases/add" element={<PurchasesAdd />} />
                <Route path="purchases/details/:id" element={<PurchasesDetails />} /> */}
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
