import axios from 'axios';
import React, { useState } from 'react';
import { Container, Form, Button, Col, Row } from 'react-bootstrap';
import { FaGoogle } from 'react-icons/fa'; // Import Google icon
import { useNavigate } from 'react-router-dom';

export default function LoginUser() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const navigate = useNavigate();

    const handleSignupClick = () => {
        window.location.href = 'http://localhost:8000/accounts/signup/';
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/users/login/', {
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true, // Use this to include cookies in the request
            });

            const { access } = response.data; // Renaming to avoid conflict
            localStorage.setItem('token', access); // Save token in localStorage
            
            console.log('access:token', access);

            setSuccess('Login successful! Redirecting to events page...');
            setError('');
            // Redirect to /event-home after a successful login
            setTimeout(() => {
                navigate('/home');
                window.location.reload();
            }, 1000); 

            // Redirect or further actions after login
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Something went wrong';
            setError(errorMessage);
            setSuccess('');
            console.error('Error during login:', err);
        }
    };

    return (
        <div className="login-page">
            <Container className="login-container">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <div className="login-card">
                            <h2 className="login-title">Login</h2>
                            <Form onSubmit={handleLogin}>
                                <Form.Group controlId="formUsername">
                                    <Form.Label>Username/Email</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter username or Email"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Button className="login-button mt-2" variant="primary" type="submit">
                                    Login
                                </Button>
                            </Form>

                            {success && <p className="text-success">{success}</p>}
                            {error && <p className="text-danger">{error}</p>}

                            <div className="separator">Or</div>

                            <Button className="google-signup-button" onClick={handleSignupClick}>
                                <FaGoogle className="google-icon" />
                                <span>Sign Up with Google</span>
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
