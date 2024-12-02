import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import Login from "./pages/Login";
import { SidebarProvider } from "./context/SidebarContext";

function App() {
  return (
    <SidebarProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard/home" element={<Home />} />
        </Routes>
      </Router>
    </SidebarProvider>
  );
}

export default App;
