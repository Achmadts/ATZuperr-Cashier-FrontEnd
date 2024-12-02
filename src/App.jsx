import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import Login from "./pages/Login";
import { SidebarProvider } from "./context/SidebarContext";
import UpdateProfileAndPassword from "./pages/dashboard/UpdateProfile";

function App() {
  return (
    <SidebarProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard/home" element={<Home />} />
          <Route
            path="/dashboard/profile-password"
            element={<UpdateProfileAndPassword />}
          />
        </Routes>
      </Router>
    </SidebarProvider>
  );
}

export default App;
