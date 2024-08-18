import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

export default function Home() {
  const [name, setName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoggedIn(false);
          return;
        }

        const response = await axios.get('api/users/profile/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true,
        });

        console.log('API Response:', response.data); // Debugging
        const username = response.data.data.username || 'Guest'; // Adjust this line based on the API response
        setName(username);
        setIsLoggedIn(true);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setIsLoggedIn(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="homepage">
      <Container fluid>
        <Row className="align-items-center">
          <Col md={6} className="text-content">
            <h1>{isLoggedIn ? `Hi, ${name}` : 'You are not logged in'}</h1>
            <p>
              Win new customers with the #1 email marketing and automations brand* that recommends ways to get more opens, clicks, and sales.
            </p>
          </Col>
          <Col md={6} className="image-container">
            <img 
              src="/hero-img-1.png" 
              alt="Hero" 
              className="hero-image" 
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
