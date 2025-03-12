import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/HotelsPage.css";
import { auth } from "../firebaseConfig";

const Bookings = () => {
  const [bookedHotels, setBookedHotels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedHotels = JSON.parse(localStorage.getItem("bookedHotels")) || [];
    setBookedHotels(storedHotels);
  }, []);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
    });
  
    return () => unsubscribe();
  }, []);
  const handleCancelBooking = (index) => {
    const updatedHotels = bookedHotels.filter((_, i) => i !== index);
    setBookedHotels(updatedHotels);
    localStorage.setItem("bookedHotels", JSON.stringify(updatedHotels));
  };

  return (
    <Container className="hotels-page">
      <h2 className="section-title">Your Booked Hotels</h2>

      {bookedHotels.length === 0 ? (
        <p>No hotels booked yet.</p>
      ) : (
        <Row>
          {bookedHotels.map((hotel, index) => (
            <Col key={index} md={4} sm={6} xs={12} className="mb-4">
              <Card className="hotel-card">
                <Card.Img variant="top" src={hotel.imageUrl} alt={hotel.name} />
                <Card.Body>
                  <Card.Title>{hotel.name}</Card.Title>
                  <p><strong>📍 Address:</strong> {hotel.address}</p>
                  <p><strong>⭐ Rating:</strong> {hotel.rating}</p>
                  <p><strong>💰 Price:</strong> {hotel.price}</p>
                  <Button variant="danger" onClick={() => handleCancelBooking(index)}>
                    Cancel Booking
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <Button variant="secondary" onClick={() => navigate("/")}>
        Back to Hotels
      </Button>
    </Container>
  );
};

export default Bookings;
