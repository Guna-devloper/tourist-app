import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Button } from "react-bootstrap";

const Dashboard = () => {
  const [places, setPlaces] = useState([]);
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    // Fetch tourist places
    axios.get("https://api.example.com/tourist-places") // Replace with actual API
      .then((response) => setPlaces(response.data))
      .catch((error) => console.error(error));

    // Fetch nearby hotels
    axios.get("https://api.example.com/nearby-hotels") // Replace with actual API
      .then((response) => setHotels(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <Container>
      <h2>Popular Tourist Places</h2>
      <div className="d-flex flex-wrap">
        {places.map((place) => (
          <Card key={place.id} style={{ width: "18rem", margin: "10px" }}>
            <Card.Img variant="top" src={place.image} />
            <Card.Body>
              <Card.Title>{place.name}</Card.Title>
              <Card.Text>{place.description}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>

      <h2>Nearby Hotels & Stays</h2>
      <div className="d-flex flex-wrap">
        {hotels.map((hotel) => (
          <Card key={hotel.id} style={{ width: "18rem", margin: "10px" }}>
            <Card.Img variant="top" src={hotel.image} />
            <Card.Body>
              <Card.Title>{hotel.name}</Card.Title>
              <Card.Text>{hotel.location}</Card.Text>
              <Button variant="primary">Book Now</Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default Dashboard;
