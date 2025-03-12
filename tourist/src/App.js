import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Bookings from "./components/Bookings";
import TouristPlaces from "./pages/TouristPlaces";
import NavbarComponent from "./components/NavbarComponent";
import HotelsPage from "./pages/HotelsPage";

function App() {
  return (
    <AuthProvider>
      <Router>
      <NavbarComponent />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/hotels" element={<HotelsPage />} />

          <Route path="/tourist" element={<TouristPlaces />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
