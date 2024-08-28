import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await axios.get('/api/users/profile/', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
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
    <div className="container-fluid p-0">
      <nav className="navbar navbar-expand-lg navbar-light bg-light header">
        <Link className="navbar-brand" to="/">
          <h1 className="display-6 text-primary m-0">
            <i className="fas fa-envelope me-3"></i>EventNest
          </h1>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {isLoggedIn ? (
              <>
                <li className="nav-item dropdown">
                  <Link className="nav-link dropdown-toggle btn btn-light" id="eventsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Events
                  </Link>
                  <ul className="dropdown-menu" aria-labelledby="eventsDropdown">
                    <li><Link className='dropdown-item' to="/event-home">Event Home</Link></li>
                    <li><Link className="dropdown-item" to="/register-attendee">Register as Attendee</Link></li>
                  </ul>
                </li>
                <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/analytics">Analytics</Link></li>
                <li className="nav-item"><button className="btn btn-light border border-primary rounded-pill text-primary py-2 px-4 me-4" onClick={handleLogout}>Logout</button></li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="btn btn-light border border-primary rounded-pill text-primary py-2 px-4 me-4" to="/login">Log In</Link></li>
                <li className="nav-item"><Link className="btn btn-primary rounded-pill text-white py-2 px-4" to="/register">Sign Up</Link></li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}
