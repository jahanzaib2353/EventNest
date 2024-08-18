import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is included

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Check if token is valid by making a request to an authenticated endpoint
          await axios.get('/api/users/profile/', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            withCredentials: true,
          });
          setIsLoggedIn(true);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    console.log('User logged out');
    navigate('/login');
  };

  return (
    <div className="container-fluid header position-relative overflow-hidden p-0">
      <nav className="navbar navbar-expand-lg fixed-top navbar-light px-4 px-lg-5 py-3 py-lg-0">
        <Link className="navbar-brand p-0" to="/">
          <h1 className="display-6 text-primary m-0">
            <i className="fas fa-envelope me-3"></i>EventNest
          </h1>
          {/* <img src="/logoEvent.png" alt="Logo" style={{ width: '50px', height: '50px', marginLeft: '30px' }} /> */}
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span className="fa fa-bars"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav ms-auto py-0">
            {isLoggedIn ? (
              <>
                <Link className="nav-item nav-link active" to="/event-home">Events</Link>
                <Link className="nav-item nav-link" to="/profile">Profile</Link>
                <Link className="nav-item nav-link" to="/analytics">Analytics</Link>
                {/* Add other links for logged-in users */}
              </>
            ) : (
              <div className="d-flex">
                <Link className="btn btn-light border border-primary rounded-pill text-primary py-2 px-4 me-4" to="/login">Log In</Link>
                <Link className="btn btn-primary rounded-pill text-white py-2 px-4" to="/register">Sign Up</Link>
              </div>
            )}
          </div>
          {isLoggedIn && (
            <div className="d-flex">
              <button className="btn btn-light border border-primary rounded-pill text-primary py-2 px-4 me-4" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
