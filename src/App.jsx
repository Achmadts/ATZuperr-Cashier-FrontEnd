import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import Login from "./pages/Login";
import UpdateProfileAndPassword from "./pages/dashboard/UpdateProfile";
import { SidebarProvider } from "./context/SidebarContext";

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
                <Route
                  path="profile-password/:id"
                  element={<UpdateProfileAndPassword />}
                />
              </Routes>
            }
          />
        </Routes>
      </Router>
    </SidebarProvider>
  );
}

export default App;
