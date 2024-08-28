// Home.js
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

        const response = await axios.get('/api/users/profile/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const username = response.data.data.username || 'Guest';
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
      <div className="hero-section text-center text-white">
        <h1>Welcome to Event Management</h1>
        <p>Create and manage your events effortlessly</p>
      </div>
      <Container fluid>
        <Row className="align-items-center">
          <Col md={6} className="text-content">
            <h1>{isLoggedIn ? `Hi, ${name}` : 'Welcome to Our Platform'}</h1>
            
            {isLoggedIn && (
              <p className="welcome-msg">We're glad to have you back, {name}!</p>
            )}
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
