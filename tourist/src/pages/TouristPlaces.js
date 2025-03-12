import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert, Button, Form } from "react-bootstrap";
import axios from "axios";
import "../styles/TouristPlaces.css"; // Import CSS

const TouristPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(""); // User input (city or state)

  // ✅ Unsplash API Key (Replace with your actual API key)
  const UNSPLASH_ACCESS_KEY = "N59uE-V9XY_U6JXwjYYRPQNWAr11V9MDlkNEMYLziTQ";

  const fetchPlaces = async (query) => {
    setLoading(true);
    setError(null);
    setPlaces([]);

    try {
      // ✅ Fetch coordinates for the location using OpenStreetMap (Nominatim)
      const OSM_API_URL = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
      const osmResponse = await axios.get(OSM_API_URL);

      if (osmResponse.data.length === 0) {
        setError("Invalid location. Please enter a valid city or state.");
        setLoading(false);
        return;
      }

      const { lat, lon } = osmResponse.data[0]; // Get latitude & longitude

      // ✅ Fetch Tourist Places from Wikipedia
      const WIKI_API_URL = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=${lat}|${lon}&gslimit=10&format=json&origin=*`;
      const wikiResponse = await axios.get(WIKI_API_URL);

      if (wikiResponse.data.query.geosearch.length === 0) {
        setError("No tourist places found for this location.");
        setLoading(false);
        return;
      }

      // ✅ Fetch images for each tourist place
      const placesData = await Promise.all(
        wikiResponse.data.query.geosearch.map(async (place) => {
          const imageUrl = await fetchImage(place.title);
          return {
            name: place.title,
            latitude: place.lat,
            longitude: place.lon,
            wikipediaUrl: `https://en.wikipedia.org/wiki/${place.title.replace(/ /g, "_")}`,
            googleMapsUrl: `https://www.google.com/maps?q=${place.lat},${place.lon}`,
            imageUrl, // ✅ Store the fetched image URL
          };
        })
      );

      setPlaces(placesData);
    } catch (error) {
      console.error("Error fetching places:", error);
      setError("Failed to load tourist places. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch relevant images from Unsplash
  const fetchImage = async (query) => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      if (response.data.results.length > 0) {
        return response.data.results[0].urls.regular;
      } else {
        return "https://via.placeholder.com/400x300?text=No+Image";
      }
    } catch (error) {
      console.error("Error fetching image:", error);
      return "https://via.placeholder.com/400x300?text=No+Image";
    }
  };

  // ✅ Fetch default places (Example: "India tourist attractions" as default)
  useEffect(() => {
    fetchPlaces("India");
  }, []);

  // ✅ Handle Search Form Submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (location.trim() === "") {
      setError("Please enter a city or state.");
      return;
    }
    fetchPlaces(location);
  };

  return (
    <Container className="tourist-places">
      <h2 className="section-title">Find Tourist Places</h2>

      {/* 🔍 Search Bar */}
      <Form onSubmit={handleSearch} className="search-form mb-4">
        <Row>
          <Col md={8}>
            <Form.Control
              type="text"
              placeholder="Enter a City or State (e.g., Tamil Nadu, Kerala, Delhi)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Button variant="primary" type="submit" className="w-100">
              Search
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Show Loading Spinner */}
      {loading && (
        <div className="loading">
          <Spinner animation="border" variant="primary" />
          <p>Loading tourist places...</p>
        </div>
      )}

      {/* Show Error Message */}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {places.map((place, index) => (
          <Col key={index} md={4} sm={6} xs={12} className="mb-4">
            <Card className="place-card">
              {/* ✅ Use the dynamically fetched image */}
              <Card.Img
                variant="top"
                src={place.imageUrl}
                alt={place.name}
              />
              <Card.Body>
                <Card.Title>{place.name}</Card.Title>
                <Button
                  variant="primary"
                  href={place.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Google Maps
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default TouristPlaces;
