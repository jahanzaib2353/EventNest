import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap'; // Assuming you're using react-bootstrap

export default function EditUser() {
    const { id } = useParams(); 
    const [username, setUsername] = useState('');
    const [status, setStatus] = useState('');
    const [email, setEmail] = useState('');
    const [organization_name, setOrganization_name] = useState('');
    const [preferences, setPreferences] = useState('');
    const [error, setError] = useState('');

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Using token:', token); // Debugging statement
    
            const response = await axios.get(`/api/users/user/${id}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            console.log('Fetched user data:', response.data); // Debugging statement
    
            const user = response.data;
            if (user) {
                setUsername(user.username || '');
                setStatus(user.status || '');
                setEmail(user.email || '');
                setOrganization_name(user.organization_name || '');
                setPreferences(user.preferences || '');
            } else {
                console.error('No user data received');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'An unexpected error occurred.';
            setError(errorMessage);
            console.error('Error during fetching:', err.response ? err.response.data : err.message);
        }
    };
    useEffect(() => {
        if (id) {
            fetchUser();
        }
    }, [id]);
        

    const handleEditUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`/api/users/user/${id}/`, {
                username,
                email,
                status,
                organization_name,
                preferences
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                alert('User updated successfully.');
            } else {
                setError('Failed to update user.');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'An unexpected error occurred.';
            setError(errorMessage);
            console.error('Error during update:', err.response ? err.response.data : err.message);
        }
    };

    return (
        <div>
            <Container className="mt-3">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <h2>Edit User</h2>
                        <Form onSubmit={handleEditUser}>
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
                                    <option value="">Select status</option>
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

                            <Button className='mt-3' variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </Col>
                </Row>
            </Container>  
        </div>
    );
}
