import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // To navigate to bookings page
import "../styles/HotelsPage.css";
import { auth } from "../firebaseConfig";


const UNSPLASH_ACCESS_KEY = "N59uE-V9XY_U6JXwjYYRPQNWAr11V9MDlkNEMYLziTQ"; // 🔑 Replace with your Unsplash API Key

const HotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("New York"); // Default city
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
    });
  
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    fetchHotels(city);
  }, []);

  const fetchHotels = async (query) => {
    setLoading(true);
    setError(null);
    setHotels([]);

    try {
      console.log(`🏨 Fetching hotels for: ${query}`);

      const response = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: { query: "luxury hotel", per_page: 6 },
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
      });

      if (!response.data.results.length) {
        throw new Error("No hotels found.");
      }

      const hotelsData = response.data.results.map((photo, index) => ({
        id: index + 1,
        name: `Luxury Hotel ${index + 1}`,
        address: `${query}, Main Street #${index + 1}`,
        imageUrl: photo.urls.small,
        price: `$${(100 + index * 50)}`, // Random prices
        rating: (4 + Math.random()).toFixed(1), // Random ratings 4.0 - 5.0
      }));

      setHotels(hotelsData);
      console.log("✅ Hotels fetched successfully.");
    } catch (error) {
      console.error("❌ Error fetching hotels:", error.message);
      setError(error.message || "Failed to load hotels.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim() === "") {
      setError("Please enter a city.");
      return;
    }
    fetchHotels(city);
  };

  const handleBooking = (hotel) => {
    alert(`✅ Booking Confirmed for ${hotel.name}!`);
    
    const existingBookings = JSON.parse(localStorage.getItem("bookedHotels")) || [];
    localStorage.setItem("bookedHotels", JSON.stringify([...existingBookings, hotel]));

    navigate("/bookings"); // Navigate to bookings page
  };

  return (
    <Container className="hotels-page">
      <h2 className="section-title">Find Hotels & Stays</h2>

      {/* 🔎 Search Form */}
      <Form onSubmit={handleSearch} className="search-form mb-4">
        <Row>
          <Col md={8} xs={8}>
            <Form.Control
              type="text"
              placeholder="Enter a City (e.g., Mumbai, Paris, Dubai)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Col>
          <Col md={4} xs={4}>
            <Button variant="primary" type="submit" className="w-100">
              Search
            </Button>
          </Col>
        </Row>
      </Form>

      {/* 🔄 Loading Spinner */}
      {loading && (
        <div className="loading">
          <Spinner animation="border" variant="primary" />
          <p>Loading hotels...</p>
        </div>
      )}

      {/* ❌ Error Message */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* 🏨 Hotel List */}
      <Row>
        {hotels.map((hotel, index) => (
          <Col key={index} md={4} sm={6} xs={12} className="mb-4">
            <Card className="hotel-card">
              <Card.Img variant="top" src={hotel.imageUrl} alt={hotel.name} />
              <Card.Body>
                <Card.Title>{hotel.name}</Card.Title>
                <p><strong>📍 Address:</strong> {hotel.address}</p>
                <p><strong>⭐ Rating:</strong> {hotel.rating}</p>
                <p><strong>💰 Price:</strong> {hotel.price}</p>
                <Button variant="success" onClick={() => handleBooking(hotel)}>
                  Book Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HotelsPage;
