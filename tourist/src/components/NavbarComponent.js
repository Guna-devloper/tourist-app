import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/NavbarComponent.css"; // Custom styling
import { auth } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const NavbarComponent = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // State to track user login status

  // ✅ Check user authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update user state
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    alert("🔒 Logged out successfully!");
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="custom-navbar" variant="dark">
      <Container>
        {/* 🔷 Logo */}
        <Navbar.Brand as={Link} to="/" className="navbar-logo">
          🏝️ TouristApp
        </Navbar.Brand>

        {/* 📱 Mobile Toggle Button */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* 🌍 Navbar Links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/tourist" className="nav-link">
              Home
            </Nav.Link>
            {user && (
              <>
                <Nav.Link as={Link} to="/hotels" className="nav-link">
                  Hotels
                </Nav.Link>
                <Nav.Link as={Link} to="/bookings" className="nav-link">
                  Bookings
                </Nav.Link>
                <Button variant="primary" onClick={handleLogout} className="ms-2">
                  Logout
                </Button>
              </>
            )}
            {!user && (
              <>
                <Nav.Link as={Link} to="/" className="nav-link">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup" className="nav-link">
                  Sign Up
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
