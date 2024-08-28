import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Card, Alert } from 'react-bootstrap';

export default function EditUser() {
    const { id } = useParams();
    const [username, setUsername] = useState('');
    const [status, setStatus] = useState('');
    const [email, setEmail] = useState('');
    const [organization_name, setOrganization_name] = useState('');
    const [preferences, setPreferences] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            fetchUser();
        }
    }, [id]);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/users/user/${id}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const user = response.data;
            if (user) {
                setUsername(user.username || '');
                setStatus(user.status || '');
                setEmail(user.email || '');
                setOrganization_name(user.organization_name || '');
                setPreferences(user.preferences || '');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'An unexpected error occurred.';
            setError(errorMessage);
        }
    };

    const handleEditUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`/api/users/user/${id}/`, {
                username,
                email,
                status,
                organization_name,
                preferences,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                alert('User updated successfully.');
            } else {
                setError('Failed to update user.');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'An unexpected error occurred.';
            setError(errorMessage);
        }
    };

    return (
        <div className="edit-user-page">
            <Card className="edit-user-card" >
                <Card.Body>
                    <h2 className="text-center mb-4">Edit User</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleEditUser}>
                        <Form.Group id="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group id="status" className="mt-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                as="select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                required
                            >
                                <option value="">Select status</option>
                                <option value="attendee">Attendee</option>
                                <option value="organizer">Organizer</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group id="email" className="mt-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group id="organization_name" className="mt-3">
                            <Form.Label>Organization Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter organization name"
                                value={organization_name}
                                onChange={(e) => setOrganization_name(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group id="preferences" className="mt-3">
                            <Form.Label>Preferences</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter preferences"
                                value={preferences}
                                onChange={(e) => setPreferences(e.target.value)}
                            />
                        </Form.Group>

                        <Button type="submit" className="w-100 mt-4" variant="primary">
                            Update User
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}
