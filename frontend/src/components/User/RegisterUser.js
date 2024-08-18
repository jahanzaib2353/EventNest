import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';

export default function RegisterUser() {
    const [username, setUsername] = useState('');
    const [status, setStatus] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [organization_name, setOrganization_name] = useState('');
    const [preferences, setPreferences] = useState('');
    const [error, setError] = useState(''); 

    const navigate = useNavigate();

    // Handle form submission
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/users/register/', { // Ensure the URL starts with '/'
                username,
                email,
                status,
                organization_name,
                password
            });

            // Handle successful registration
            console.log('Registration successful:', response.data);

            // Optionally, redirect or show success message
            navigate('/home');
        } catch (err) {
            setError('Registration failed. Please check your credentials.'); // Fixed error message
            console.error('Error during registration:', err);
        }
    };

    return (
        <div className="register-page">
            <Container className="register-container">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <div className="register-card">
                            <h2 className="register-title">Registration Form</h2>
                            <Form onSubmit={handleRegister}>
                                <Form.Group controlId="formUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formStatus">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="attendee">Attendee</option>
                                        <option value="organizer">Organizer</option>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formOrganization">
                                    <Form.Label>Organization Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter organization name"
                                        value={organization_name}
                                        onChange={(e) => setOrganization_name(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formPreferences">
                                    <Form.Label>Preferences</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter preferences"
                                        value={preferences}
                                        onChange={(e) => setPreferences(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>

                                <Button className="register-button mt-3" variant="primary" type="submit">
                                    Register
                                </Button>
                            </Form>

                            <p className="mt-3">
                                <b>Or...</b> 
                                <Link to="/login">
                                    <Button variant="link" className="login-link">Login</Button>
                                </Link>
                            </p>

                            {error && <p className="text-danger">{error}</p>}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
